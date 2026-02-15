import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../../providers/ThemeProvider';
import { Theme, Themes } from '../../models/Theme';

// Test component to interact with theme
const ThemeController = () => {
  const { theme, setTheme, defaultTheme } = useTheme();

  const darkTheme = Themes.find((t) => t.theme === 'dark');
  const lightTheme = Themes.find((t) => t.theme === 'light');

  return (
    <div>
      <span data-testid="current-theme">{theme?.name}</span>
      <span data-testid="current-theme-value">{theme?.theme}</span>
      <span data-testid="default-theme">{defaultTheme?.name}</span>
      <button
        data-testid="theme-btn-dark"
        onClick={() => setTheme?.(darkTheme)}
      >
        Dark
      </button>
      <button
        data-testid="theme-btn-light"
        onClick={() => setTheme?.(lightTheme)}
      >
        Light
      </button>
    </div>
  );
};

// Helper to get localStorage mock
const getStoredTheme = (): Theme | null => {
  const stored = localStorage.getItem('theme');
  return stored ? JSON.parse(stored) : null;
};

describe('Theme Persistence Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.className = '';
    document.body.removeAttribute('data-theme');
  });

  describe('initial theme loading', () => {
    it('uses system preference when no stored theme', () => {
      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      // matchMedia is mocked to return matches: false (light mode)
      expect(screen.getByTestId('default-theme')).toHaveTextContent('Light');
    });

    it('loads stored theme from localStorage', () => {
      const darkTheme: Theme = { name: 'Dark warm', theme: 'dark', colour: '#1F1B18' };
      localStorage.setItem('theme', JSON.stringify(darkTheme));

      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('Dark warm');
    });
  });

  describe('theme switching', () => {
    it('switches from light to dark theme', async () => {
      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      const darkButton = screen.getByTestId('theme-btn-dark');
      await user.click(darkButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('Dark warm');
      });
    });

    it('switches from dark to light theme', async () => {
      const darkTheme: Theme = { name: 'Dark warm', theme: 'dark', colour: '#1F1B18' };
      localStorage.setItem('theme', JSON.stringify(darkTheme));

      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      const lightButton = screen.getByTestId('theme-btn-light');
      await user.click(lightButton);

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('Light');
      });
    });

    it('updates body class when theme changes', async () => {
      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      const darkButton = screen.getByTestId('theme-btn-dark');
      await user.click(darkButton);

      await waitFor(() => {
        expect(document.body.className).toBe('dark');
      });
    });
  });

  describe('localStorage persistence', () => {
    it('persists theme selection to localStorage', async () => {
      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      const darkButton = screen.getByTestId('theme-btn-dark');
      await user.click(darkButton);

      await waitFor(() => {
        const stored = getStoredTheme();
        expect(stored?.name).toBe('Dark warm');
        expect(stored?.theme).toBe('dark');
      });
    });

    it('updates localStorage when theme changes multiple times', async () => {
      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      // Switch to dark
      await user.click(screen.getByTestId('theme-btn-dark'));
      await waitFor(() => {
        expect(getStoredTheme()?.theme).toBe('dark');
      });

      // Switch back to light
      await user.click(screen.getByTestId('theme-btn-light'));
      await waitFor(() => {
        expect(getStoredTheme()?.theme).toBe('light');
      });
    });

    it('theme persists across component remounts', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('theme-btn-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('Dark warm');
      });

      unmount();

      // Remount - should load persisted theme
      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('Dark warm');
    });
  });

  describe('context access', () => {
    it('provides theme context to deeply nested components', () => {
      const DeepChild = () => {
        const { theme } = useTheme();
        return <span data-testid="deep-theme">{theme?.name}</span>;
      };

      render(
        <ThemeProvider>
          <div>
            <div>
              <div>
                <DeepChild />
              </div>
            </div>
          </div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('deep-theme')).toBeInTheDocument();
    });

    it('multiple consumers receive same theme state', async () => {
      const Consumer1 = () => {
        const { theme } = useTheme();
        return <span data-testid="consumer-1">{theme?.name}</span>;
      };

      const Consumer2 = () => {
        const { theme } = useTheme();
        return <span data-testid="consumer-2">{theme?.name}</span>;
      };

      render(
        <ThemeProvider>
          <Consumer1 />
          <Consumer2 />
          <ThemeController />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('theme-btn-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('consumer-1')).toHaveTextContent('Dark warm');
        expect(screen.getByTestId('consumer-2')).toHaveTextContent('Dark warm');
      });
    });
  });

  describe('body attributes', () => {
    it('sets data-theme attribute', async () => {
      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('theme-btn-dark'));

      await waitFor(() => {
        expect(document.body.getAttribute('data-theme')).toBe('dark');
      });
    });

    it('sets light data-theme for light themes', async () => {
      const darkTheme: Theme = { name: 'Dark warm', theme: 'dark', colour: '#1F1B18' };
      localStorage.setItem('theme', JSON.stringify(darkTheme));

      render(
        <ThemeProvider>
          <ThemeController />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('theme-btn-light'));

      await waitFor(() => {
        expect(document.body.getAttribute('data-theme')).toBe('light');
      });
    });
  });
});
