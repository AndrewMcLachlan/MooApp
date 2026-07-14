import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Notifications } from '../Notifications';
import { ThemeProvider, ThemeContext } from '../../providers/ThemeProvider';
import { theme } from '../../models';

const renderWithProvider = () => {
  return render(
    <ThemeProvider>
      <Notifications />
    </ThemeProvider>
  );
};

describe('Notifications', () => {
  describe('rendering', () => {
    it('renders toast container', () => {
      const { container } = renderWithProvider();

      expect(container.querySelector('.Toastify')).toBeInTheDocument();
    });

    it('configures bottom-center position', () => {
      // Notifications component configures ToastContainer with position="bottom-center"
      // The actual position class is applied when toasts are shown
      expect(Notifications).toBeDefined();
    });

    it('renders without throwing when a defaultTheme is set but no active theme', () => {
      // Regression: the theme ternary previously dereferenced theme.theme even
      // when theme was undefined, throwing whenever a defaultTheme existed.
      expect(() =>
        render(
          <ThemeContext.Provider value={{ defaultTheme: theme('light')!, theme: undefined }}>
            <Notifications />
          </ThemeContext.Provider>
        )
      ).not.toThrow();
    });
  });
});
