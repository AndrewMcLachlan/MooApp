import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../ThemeProvider';
import { Themes } from '../../models';

// Mock meta element for theme-color
const createMockMetaElement = () => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  meta.content = '';
  document.head.appendChild(meta);
  return meta;
};

describe('ThemeProvider', () => {
  let matchMediaListeners: Array<(e: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    // Clear localStorage
    window.localStorage.clear();

    // Reset body attributes
    document.body.removeAttribute('class');
    document.body.removeAttribute('data-theme');

    // Remove existing meta elements
    document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove());

    // Create mock meta element
    createMockMetaElement();

    // Reset matchMedia listeners
    matchMediaListeners = [];

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false, // Default to light mode
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            matchMediaListeners.push(listener);
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('rendering', () => {
    it('renders children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Child content</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(ThemeProvider.displayName).toBe('ThemeProvider');
    });
  });

  describe('useTheme hook', () => {
    it('returns theme context when used inside provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.defaultTheme).toBeDefined();
      expect(typeof result.current.setTheme).toBe('function');
    });

    it('returns default context when used outside provider', () => {
      const { result } = renderHook(() => useTheme());

      // Outside provider, returns the default context value
      expect(result.current.defaultTheme).toBeDefined();
    });
  });

  describe('default theme', () => {
    it('uses light theme when system prefers light', () => {
      // matchMedia already mocked to return matches: false (light mode)
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.defaultTheme?.theme).toBe('light');
    });

    it('uses dark theme when system prefers dark', () => {
      // Override matchMedia to return dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('dark'),
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.defaultTheme?.theme).toBe('dark');
    });
  });

  describe('theme persistence', () => {
    it('stores theme in localStorage', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      const darkTheme = Themes.find(t => t.theme === 'dark');

      act(() => {
        result.current.setTheme?.(darkTheme);
      });

      const stored = JSON.parse(window.localStorage.getItem('theme') || '{}');
      expect(stored.theme).toBe('dark');
    });

    it('loads theme from localStorage on mount', () => {
      const darkTheme = Themes.find(t => t.theme === 'dark');
      window.localStorage.setItem('theme', JSON.stringify(darkTheme));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme?.theme).toBe('dark');
    });
  });

  describe('document updates', () => {
    it('updates body class when theme changes', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      const darkTheme = Themes.find(t => t.theme === 'dark');

      act(() => {
        result.current.setTheme?.(darkTheme);
      });

      expect(document.body.getAttribute('class')).toBe('dark');
    });

    it('updates data-theme attribute', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      const darkTheme = Themes.find(t => t.theme === 'dark');

      act(() => {
        result.current.setTheme?.(darkTheme);
      });

      expect(document.body.getAttribute('data-theme')).toBe('dark');
    });

    it('sets data-theme to light for light themes', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      const lightTheme = Themes.find(t => t.theme === 'light');

      act(() => {
        result.current.setTheme?.(lightTheme);
      });

      expect(document.body.getAttribute('data-theme')).toBe('light');
    });

    it('accesses theme-color meta element on mount', () => {
      // The ThemeProvider accesses document.getElementsByName("theme-color")[0]
      // and updates its content attribute. This test verifies no errors occur.
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      const darkTheme = Themes.find(t => t.theme === 'dark');

      // Verify setTheme works without errors
      act(() => {
        result.current.setTheme?.(darkTheme);
      });

      // Theme should be updated
      expect(result.current.theme?.theme).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('updates current theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      const darkBlueTheme = Themes.find(t => t.theme === 'dark blue');

      act(() => {
        result.current.setTheme?.(darkBlueTheme);
      });

      expect(result.current.theme?.theme).toBe('dark blue');
      expect(result.current.theme?.name).toBe('Dark cool');
    });

    it('can cycle through all themes', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper });

      Themes.forEach((theme) => {
        act(() => {
          result.current.setTheme?.(theme);
        });

        expect(result.current.theme?.name).toBe(theme.name);
      });
    });
  });

  describe('available themes', () => {
    it('has System theme', () => {
      const systemTheme = Themes.find(t => t.name === 'System');
      expect(systemTheme).toBeDefined();
      expect(systemTheme?.theme).toBe('');
    });

    it('has Dark warm theme', () => {
      const darkTheme = Themes.find(t => t.name === 'Dark warm');
      expect(darkTheme).toBeDefined();
      expect(darkTheme?.theme).toBe('dark');
      expect(darkTheme?.colour).toBe('#1F1B18');
    });

    it('has Dark cool theme', () => {
      const darkBlueTheme = Themes.find(t => t.name === 'Dark cool');
      expect(darkBlueTheme).toBeDefined();
      expect(darkBlueTheme?.theme).toBe('dark blue');
      expect(darkBlueTheme?.colour).toBe('#181B1F');
    });

    it('has Light theme', () => {
      const lightTheme = Themes.find(t => t.name === 'Light');
      expect(lightTheme).toBeDefined();
      expect(lightTheme?.theme).toBe('light');
      expect(lightTheme?.colour).toBe('#FFF');
    });

    it('has Red theme', () => {
      const redTheme = Themes.find(t => t.name === 'Red');
      expect(redTheme).toBeDefined();
      expect(redTheme?.theme).toBe('light red');
      expect(redTheme?.colour).toBe('#620000');
    });
  });
});
