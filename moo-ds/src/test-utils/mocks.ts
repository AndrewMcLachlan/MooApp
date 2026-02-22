import { vi } from 'vitest';

/**
 * Creates a mock localStorage/sessionStorage instance
 * Provides access to internal store for test assertions
 */
export const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    // Test helpers
    _getStore: () => store,
    _setStore: (newStore: Record<string, string>) => { store = newStore; },
  };
};

/**
 * Creates a mock matchMedia instance
 * @param matches - Whether the media query matches (default: false = light mode)
 */
export const createMatchMediaMock = (matches = false) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

/**
 * Mocks the theme-color meta element for ThemeProvider
 * Returns the mock element for assertions
 */
export const mockThemeColorMeta = () => {
  const mockElement = { setAttribute: vi.fn() };
  document.getElementsByName = vi.fn().mockReturnValue([mockElement]);
  return mockElement;
};

/**
 * Creates a mock for window.matchMedia with dark mode preference
 */
export const mockDarkModePreference = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMatchMediaMock(true),
  });
};

/**
 * Creates a mock for window.matchMedia with light mode preference
 */
export const mockLightModePreference = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMatchMediaMock(false),
  });
};

/**
 * Resets localStorage mock to empty state
 */
export const resetLocalStorage = () => {
  (window.localStorage.clear as unknown as () => void)();
};

/**
 * Resets sessionStorage mock to empty state
 */
export const resetSessionStorage = () => {
  (window.sessionStorage.clear as unknown as () => void)();
};
