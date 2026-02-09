import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Error as ErrorPage } from '../Error';

// Mock react-router
const mockNavigate = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/error' }),
}));

// Mock useIsAuthenticated for Page component
vi.mock('@azure/msal-react', () => ({
  useIsAuthenticated: () => true,
}));

// Mock useLayout for Page component
vi.mock('../../providers', () => ({
  useLayout: () => ({
    setBreadcrumbs: vi.fn(),
    setSecondaryNav: vi.fn(),
    setActions: vi.fn(),
  }),
}));

// Mock useApp for usePageTitle
vi.mock('../../providers/AppProvider', () => ({
  useApp: () => ({ name: 'Test App' }),
}));

describe('Error Page', () => {
  const defaultProps = {
    error: new Error('Something went wrong'),
    resetErrorBoundary: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.title = '';
  });

  describe('rendering', () => {
    it('renders error page container', () => {
      const { container } = render(<ErrorPage {...defaultProps} />);

      expect(container.querySelector('.error-page')).toBeInTheDocument();
    });

    it('renders error message in pre element', () => {
      const { container } = render(<ErrorPage {...defaultProps} />);

      const pre = container.querySelector('pre');
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toBe('Something went wrong');
    });

    it('renders error fallback heading', () => {
      const { container } = render(<ErrorPage {...defaultProps} />);

      const heading = container.querySelector('.alert-heading');
      expect(heading).toBeInTheDocument();
    });

    it('renders dismissible alert', () => {
      const { container } = render(<ErrorPage {...defaultProps} />);

      const closeButton = container.querySelector('.btn-close');
      expect(closeButton).toBeInTheDocument();
    });

    it('renders navigation message', () => {
      render(<ErrorPage {...defaultProps} />);

      expect(screen.getByText('Close this alert to go back to the previous page.')).toBeInTheDocument();
    });

    it('sets page title to Error', () => {
      render(<ErrorPage {...defaultProps} />);

      expect(document.title).toBe('Error : Test App');
    });
  });

  describe('navigation', () => {
    it('navigates back when alert is dismissed', () => {
      const { container } = render(<ErrorPage {...defaultProps} />);

      const closeButton = container.querySelector('.btn-close');
      fireEvent.click(closeButton!);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('calls resetErrorBoundary when dismissed', () => {
      const { container } = render(<ErrorPage {...defaultProps} />);

      const closeButton = container.querySelector('.btn-close');
      fireEvent.click(closeButton!);

      expect(defaultProps.resetErrorBoundary).toHaveBeenCalled();
    });
  });

  describe('error types', () => {
    it('displays TypeError message', () => {
      const props = {
        ...defaultProps,
        error: new TypeError('Cannot read property of null'),
      };

      render(<ErrorPage {...props} />);

      expect(screen.getByText('Cannot read property of null')).toBeInTheDocument();
    });

    it('displays ReferenceError message', () => {
      const props = {
        ...defaultProps,
        error: new ReferenceError('foo is not defined'),
      };

      render(<ErrorPage {...props} />);

      expect(screen.getByText('foo is not defined')).toBeInTheDocument();
    });

    it('displays custom error message', () => {
      const customError = new Error('Custom application error');

      render(<ErrorPage {...defaultProps} error={customError} />);

      expect(screen.getByText('Custom application error')).toBeInTheDocument();
    });
  });
});
