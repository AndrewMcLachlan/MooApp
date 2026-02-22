import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserMenu } from '../UserMenu';

// Mock MSAL
const mockLogoutRedirect = vi.fn();
const mockGetActiveAccount = vi.fn();
let mockIsAuthenticated = true;

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      getActiveAccount: mockGetActiveAccount,
      logoutRedirect: mockLogoutRedirect,
    },
    accounts: [] as any[],
    inProgress: 'none',
  }),
  useIsAuthenticated: () => mockIsAuthenticated,
}));

// Mock moo-ds
vi.mock('@andrewmclachlan/moo-ds', () => ({
  NavItemList: ({ navItems }: { navItems: any[] }) => (
    <div data-testid="nav-items">{navItems?.length ?? 0} items</div>
  ),
  OverlayTrigger: ({ children, overlay }: any) => (
    <div data-testid="overlay-trigger">
      {children}
      <div data-testid="overlay-content">{overlay}</div>
    </div>
  ),
  Popover: Object.assign(
    ({ children, id, className }: any) => (
      <div id={id} className={className} data-testid="popover">{children}</div>
    ),
    {
      Header: ({ children }: any) => <div data-testid="popover-header">{children}</div>,
      Body: ({ children }: any) => <div data-testid="popover-body">{children}</div>,
    }
  ),
}));

// Mock Avatar component
vi.mock('../../components', () => ({
  Avatar: () => <div data-testid="avatar">Avatar</div>,
}));

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: any) => <span data-testid="icon">{icon}</span>,
}));

describe('UserMenu', () => {
  beforeEach(() => {
    mockLogoutRedirect.mockClear();
    mockGetActiveAccount.mockClear();
    mockIsAuthenticated = true;
    mockGetActiveAccount.mockReturnValue({ name: 'Test User', username: 'test@example.com' });
  });

  describe('when authenticated', () => {
    it('renders user menu', () => {
      render(<UserMenu />);

      expect(screen.getByTestId('overlay-trigger')).toBeInTheDocument();
    });

    it('renders avatar', () => {
      render(<UserMenu />);

      expect(screen.getAllByTestId('avatar').length).toBeGreaterThan(0);
    });

    it('displays user name in popover header', () => {
      render(<UserMenu />);

      expect(screen.getByTestId('popover-header')).toHaveTextContent('Test User');
    });

    it('renders sign out option', () => {
      render(<UserMenu />);

      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });

    it('calls logoutRedirect when sign out clicked', () => {
      render(<UserMenu />);

      fireEvent.click(screen.getByText('Sign out'));

      expect(mockLogoutRedirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('when not authenticated', () => {
    beforeEach(() => {
      mockIsAuthenticated = false;
    });

    it('returns null', () => {
      const { container } = render(<UserMenu />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('with userMenu prop', () => {
    it('renders custom menu items', () => {
      const userMenu = [
        { text: 'Profile', route: '/profile' },
        { text: 'Settings', route: '/settings' },
      ];

      render(<UserMenu userMenu={userMenu} />);

      expect(screen.getByTestId('nav-items')).toHaveTextContent('2 items');
    });

    it('renders with empty userMenu', () => {
      render(<UserMenu userMenu={[]} />);

      expect(screen.getByTestId('nav-items')).toHaveTextContent('0 items');
    });

    it('renders with default empty userMenu', () => {
      render(<UserMenu />);

      expect(screen.getByTestId('nav-items')).toHaveTextContent('0 items');
    });
  });

  describe('popover structure', () => {
    it('has user-popover id', () => {
      render(<UserMenu />);

      expect(screen.getByTestId('popover')).toHaveAttribute('id', 'user-popover');
    });

    it('has user-popover class', () => {
      render(<UserMenu />);

      expect(screen.getByTestId('popover')).toHaveClass('user-popover');
    });

    it('has popover body with menu items', () => {
      render(<UserMenu />);

      expect(screen.getByTestId('popover-body')).toBeInTheDocument();
    });
  });
});
