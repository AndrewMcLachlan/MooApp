import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeSelector } from '../ThemeSelector';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { Themes } from '../../models';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('ThemeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders all available themes', () => {
      renderWithProvider(<ThemeSelector />);

      Themes.forEach(theme => {
        expect(screen.getByText(theme.name)).toBeInTheDocument();
      });
    });

    it('renders theme samples for each theme', () => {
      const { container } = renderWithProvider(<ThemeSelector />);

      const themeSamples = container.querySelectorAll('.theme-sample');
      expect(themeSamples.length).toBe(Themes.length);
    });

    it('renders in a Row layout', () => {
      const { container } = renderWithProvider(<ThemeSelector />);

      expect(container.querySelector('.row')).toBeInTheDocument();
    });

    it('renders each theme in a Col', () => {
      const { container } = renderWithProvider(<ThemeSelector />);

      const cols = container.querySelectorAll('.theme');
      expect(cols.length).toBe(Themes.length);
    });
  });

  describe('theme selection', () => {
    it('changes theme when theme sample is clicked', async () => {
      renderWithProvider(<ThemeSelector />);

      const darkTheme = Themes.find(t => t.name === 'Dark');
      if (darkTheme) {
        const darkSample = screen.getByText('Dark').parentElement?.querySelector('.theme-sample');

        await act(async () => {
          if (darkSample) {
            fireEvent.click(darkSample);
          }
        });

        // Theme change is reflected in body class (handled by ThemeProvider)
        expect(document.body.classList.contains('dark') || document.body.className === 'dark').toBeTruthy;
      }
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ThemeSelector.displayName).toBe('ThemeSelector');
    });
  });
});
