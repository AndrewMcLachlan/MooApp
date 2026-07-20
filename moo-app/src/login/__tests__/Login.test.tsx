import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Login } from '../Login';

// Mock MSAL authentication hook
const mockUseMsalAuthentication = vi.fn();
const mockUseIsAuthenticated = vi.fn();
const mockUseMsal = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsalAuthentication: (interactionType: any, request: any) => {
    mockUseMsalAuthentication(interactionType, request);
    return {
      login: vi.fn(),
      result: null as any,
      error: null as any,
    };
  },
  useIsAuthenticated: () => mockUseIsAuthenticated(),
  useMsal: () => mockUseMsal(),
}));

vi.mock('@azure/msal-browser', () => ({
  InteractionType: {
    Redirect: 'redirect',
    Popup: 'popup',
    Silent: 'silent',
  },
  InteractionStatus: {
    None: 'none',
    Startup: 'startup',
    Login: 'login',
    Logout: 'logout',
    AcquireToken: 'acquireToken',
    SsoSilent: 'ssoSilent',
    HandleRedirect: 'handleRedirect',
  },
}));

vi.mock('../msal', () => ({
  loginRequest: { scopes: ['openid', 'profile'] },
}));

describe('Login', () => {
  beforeEach(() => {
    mockUseMsalAuthentication.mockClear();
    mockUseIsAuthenticated.mockClear();
    mockUseIsAuthenticated.mockReturnValue(true);
    // Default to MSAL idle so existing "authenticated" cases render children.
    mockUseMsal.mockReset();
    mockUseMsal.mockReturnValue({ inProgress: 'none' });
  });

  describe('rendering', () => {
    it('renders children when authenticated', () => {
      render(
        <Login>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('does not render children when not authenticated', () => {
      mockUseIsAuthenticated.mockReturnValue(false);

      const { container } = render(
        <Login>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
      expect(container.innerHTML).toBe('');
    });

    it('does not render children while an MSAL interaction is in progress, even when authenticated', () => {
      // A cached account makes isAuthenticated true immediately on a re-auth
      // reload, but MSAL is still mid-flight. Rendering data-fetching children
      // now races the token interceptor (acquireTokenSilent -> interaction_in_progress
      // -> cancelled request -> permanently errored query with retry:false).
      mockUseIsAuthenticated.mockReturnValue(true);
      mockUseMsal.mockReturnValue({ inProgress: 'handleRedirect' });

      render(
        <Login authFallback={<div data-testid="loading">Loading...</div>}>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('renders children once the interaction completes (inProgress None)', () => {
      mockUseIsAuthenticated.mockReturnValue(true);
      mockUseMsal.mockReturnValue({ inProgress: 'none' });

      render(
        <Login>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Login>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </Login>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });

    it('renders nested components', () => {
      render(
        <Login>
          <div>
            <span data-testid="nested">Nested Content</span>
          </div>
        </Login>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });
  });

  describe('authentication', () => {
    it('calls useMsalAuthentication with Redirect interaction type', () => {
      render(
        <Login>
          <div>Content</div>
        </Login>
      );

      expect(mockUseMsalAuthentication).toHaveBeenCalledWith(
        'redirect',
        expect.any(Object)
      );
    });

    it('passes loginRequest to useMsalAuthentication', () => {
      render(
        <Login>
          <div>Content</div>
        </Login>
      );

      expect(mockUseMsalAuthentication).toHaveBeenCalledWith(
        expect.anything(),
        { scopes: ['openid', 'profile'] }
      );
    });

    it('calls authentication hook on mount', () => {
      render(
        <Login>
          <div>Content</div>
        </Login>
      );

      expect(mockUseMsalAuthentication).toHaveBeenCalledTimes(1);
    });

    it('calls useMsalAuthentication even when not authenticated', () => {
      mockUseIsAuthenticated.mockReturnValue(false);

      render(
        <Login>
          <div>Content</div>
        </Login>
      );

      expect(mockUseMsalAuthentication).toHaveBeenCalledWith(
        'redirect',
        expect.any(Object)
      );
    });
  });

  describe('authFallback', () => {
    it('renders authFallback when not authenticated', () => {
      mockUseIsAuthenticated.mockReturnValue(false);

      render(
        <Login authFallback={<div data-testid="loading">Loading...</div>}>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    });

    it('renders children instead of fallback when authenticated', () => {
      render(
        <Login authFallback={<div data-testid="loading">Loading...</div>}>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('renders nothing when not authenticated and no fallback provided', () => {
      mockUseIsAuthenticated.mockReturnValue(false);

      const { container } = render(
        <Login>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(container.innerHTML).toBe('');
    });
  });

  describe('with different children types', () => {
    it('renders text children', () => {
      render(<Login>Plain text content</Login>);

      expect(screen.getByText('Plain text content')).toBeInTheDocument();
    });

    it('renders null children without error', () => {
      const { container } = render(<Login>{null}</Login>);

      expect(container).toBeInTheDocument();
    });

    it('renders fragment children', () => {
      render(
        <Login>
          <>
            <span data-testid="frag1">Fragment 1</span>
            <span data-testid="frag2">Fragment 2</span>
          </>
        </Login>
      );

      expect(screen.getByTestId('frag1')).toBeInTheDocument();
      expect(screen.getByTestId('frag2')).toBeInTheDocument();
    });
  });
});
