import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Notifications } from '../Notifications';
import { ThemeContext } from '../../providers/ThemeProvider';
import { theme } from '../../models';

// Capture the resolved `theme` prop passed to ToastContainer so we can assert
// how the component derives it from the theme context.
vi.mock('react-toastify', () => ({
  Slide: {},
  ToastContainer: (props: { theme?: string }) => (
    <div className="Toastify" data-testid="toast-container" data-theme={props.theme} />
  ),
}));

const renderWithContext = (value: any) =>
  render(
    <ThemeContext.Provider value={value}>
      <Notifications />
    </ThemeContext.Provider>
  );

describe('Notifications', () => {
  describe('rendering', () => {
    it('renders toast container', () => {
      renderWithContext({ defaultTheme: theme('light'), theme: theme('light') });

      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('toast theme resolution', () => {
    it('uses the active theme when set', () => {
      renderWithContext({ defaultTheme: theme('light'), theme: theme('dark') });

      expect(screen.getByTestId('toast-container')).toHaveAttribute('data-theme', 'dark');
    });

    it('falls back to a dark defaultTheme when there is no active theme', () => {
      // Regression: previously the fallback always resolved to "light" when
      // theme was undefined, ignoring a dark defaultTheme.
      renderWithContext({ defaultTheme: theme('dark'), theme: undefined });

      expect(screen.getByTestId('toast-container')).toHaveAttribute('data-theme', 'dark');
    });

    it('falls back to a light defaultTheme when there is no active theme', () => {
      renderWithContext({ defaultTheme: theme('light'), theme: undefined });

      expect(screen.getByTestId('toast-container')).toHaveAttribute('data-theme', 'light');
    });

    it('follows the defaultTheme for the "System" ("") theme', () => {
      renderWithContext({ defaultTheme: theme('dark'), theme: theme('') });

      expect(screen.getByTestId('toast-container')).toHaveAttribute('data-theme', 'dark');
    });

    it('does not throw when both theme and defaultTheme are undefined', () => {
      expect(() => renderWithContext({ defaultTheme: undefined, theme: undefined })).not.toThrow();
    });
  });
});
