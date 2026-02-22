import { describe, it, expect } from 'vitest';
import { render, screen, renderWithTheme, renderWithMessages } from '../test-utils';
import { useTheme } from '../providers/ThemeProvider';
import { useMessages } from '../providers/MessageProvider';
import { useLink } from '../providers/LinkProvider';
import {
  createStorageMock,
  createMatchMediaMock,
  mockThemeColorMeta,
} from '../test-utils/mocks';

// Test component that uses all providers
const TestComponent = () => {
  const theme = useTheme();
  const messages = useMessages();
  const Link = useLink();

  return (
    <div>
      <span data-testid="theme">{theme?.theme?.name ?? 'No theme'}</span>
      <span data-testid="messages">{messages?.messages?.length ?? 0}</span>
      <Link to="/test">Test Link</Link>
    </div>
  );
};

// Component that only needs theme
const ThemeOnlyComponent = () => {
  const theme = useTheme();
  return <span data-testid="theme-only">{theme?.theme?.name ?? 'No theme'}</span>;
};

// Component that only needs messages
const MessagesOnlyComponent = () => {
  const messages = useMessages();
  return <span data-testid="messages-only">{messages?.messages?.length ?? 0}</span>;
};

describe('Test Utilities', () => {
  describe('render (with all providers)', () => {
    it('provides ThemeProvider context', () => {
      render(<TestComponent />);
      expect(screen.getByTestId('theme')).toBeInTheDocument();
    });

    it('provides MessageProvider context', () => {
      render(<TestComponent />);
      expect(screen.getByTestId('messages')).toHaveTextContent('0');
    });

    it('provides LinkProvider context', () => {
      render(<TestComponent />);
      const link = screen.getByRole('link', { name: 'Test Link' });
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('renderWithTheme', () => {
    it('provides only ThemeProvider context', () => {
      renderWithTheme(<ThemeOnlyComponent />);
      expect(screen.getByTestId('theme-only')).toBeInTheDocument();
    });
  });

  describe('renderWithMessages', () => {
    it('provides only MessageProvider context', () => {
      renderWithMessages(<MessagesOnlyComponent />);
      expect(screen.getByTestId('messages-only')).toHaveTextContent('0');
    });
  });

  describe('mocks', () => {
    describe('createStorageMock', () => {
      it('creates a working storage mock', () => {
        const storage = createStorageMock();

        storage.setItem('key', 'value');
        expect(storage.getItem('key')).toBe('value');
        expect(storage.setItem).toHaveBeenCalledWith('key', 'value');
      });

      it('clears storage', () => {
        const storage = createStorageMock();

        storage.setItem('key1', 'value1');
        storage.setItem('key2', 'value2');
        storage.clear();

        expect(storage.getItem('key1')).toBeNull();
        expect(storage.getItem('key2')).toBeNull();
      });

      it('provides access to internal store', () => {
        const storage = createStorageMock();

        storage.setItem('key', 'value');
        expect(storage._getStore()).toEqual({ key: 'value' });
      });
    });

    describe('createMatchMediaMock', () => {
      it('creates mock with matches: false by default', () => {
        const matchMedia = createMatchMediaMock();
        const result = matchMedia('(prefers-color-scheme: dark)');

        expect(result.matches).toBe(false);
        expect(result.media).toBe('(prefers-color-scheme: dark)');
      });

      it('creates mock with matches: true when specified', () => {
        const matchMedia = createMatchMediaMock(true);
        const result = matchMedia('(prefers-color-scheme: dark)');

        expect(result.matches).toBe(true);
      });

      it('provides event listener methods', () => {
        const matchMedia = createMatchMediaMock();
        const result = matchMedia('test');

        expect(typeof result.addEventListener).toBe('function');
        expect(typeof result.removeEventListener).toBe('function');
      });
    });

    describe('mockThemeColorMeta', () => {
      it('mocks document.getElementsByName', () => {
        const mockElement = mockThemeColorMeta();

        const elements = document.getElementsByName('theme-color');
        expect(elements).toHaveLength(1);
        expect(elements[0]).toBe(mockElement);
      });
    });
  });
});
