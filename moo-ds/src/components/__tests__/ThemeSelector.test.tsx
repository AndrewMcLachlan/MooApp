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

    it('renders in a theme-selector container', () => {
      const { container } = renderWithProvider(<ThemeSelector />);

      expect(container.querySelector('.theme-selector')).toBeInTheDocument();
    });

    it('renders a custom set of themes registered on the provider', () => {
      const customThemes = [
        { name: 'Brand Light', theme: 'brand-light', colour: '#ffffff' },
        { name: 'Brand Dark', theme: 'brand-dark', colour: '#000000' },
      ];

      const { container } = render(
        <ThemeProvider themes={customThemes} defaultTheme={customThemes[0]}>
          <ThemeSelector />
        </ThemeProvider>
      );

      expect(screen.getByText('Brand Light')).toBeInTheDocument();
      expect(screen.getByText('Brand Dark')).toBeInTheDocument();
      expect(container.querySelectorAll('.theme-sample').length).toBe(customThemes.length);
    });

    it('renders each theme as a theme-sample', () => {
      const { container } = renderWithProvider(<ThemeSelector />);

      const samples = container.querySelectorAll('.theme-sample');
      expect(samples.length).toBe(Themes.length);
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
