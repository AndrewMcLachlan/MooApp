import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Mobile/Sidebar';

const mockLogoutRedirect = vi.fn();
const mockUseLayout = vi.fn();
const mockSetTheme = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: { getActiveAccount: () => ({ name: 'Test User' }), logoutRedirect: mockLogoutRedirect },
    accounts: [] as any[],
    inProgress: 'none',
  }),
  useIsAuthenticated: () => true,
}));

vi.mock('../../providers', () => ({
  useLayout: () => mockUseLayout(),
  useApp: () => ({ name: 'Test App', version: '1.0.0' }),
}));

vi.mock('../../components', () => ({
  Avatar: () => <div data-testid="avatar">Avatar</div>,
}));

vi.mock('@andrewmclachlan/moo-ds', async () => {
  const React = await import('react');
  return {
  Drawer: Object.assign(
    ({ children }: any) => <div data-testid="drawer">{children}</div>,
    {
      Header: ({ children }: any) => <div>{children}</div>,
      Body: ({ children }: any) => <div>{children}</div>,
    }
  ),
  Nav: Object.assign(
    ({ children }: any) => <nav>{children}</nav>,
    {
      Item: ({ children, className }: any) => <div className={['nav-item', className].filter(Boolean).join(' ')}>{children}</div>,
      Link: ({ children, className, as: Tag = 'a', ...rest }: any) => (
        <Tag className={['nav-link', className].filter(Boolean).join(' ')} {...rest}>{children}</Tag>
      ),
    }
  ),
  NavItemList: ({ navItems }: { navItems: any[] }) => (
    <ul>{navItems?.map((item: any, i: number) => <li key={i}>{item.text}</li>)}</ul>
  ),
  // Renders the trigger always and the items only once opened, like the real one.
  Menu: Object.assign(
    ({ trigger, children }: any) => {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <div onClick={() => setOpen(true)}>{trigger}</div>
          {open && <ul role="menu">{children}</ul>}
        </div>
      );
    },
    {
      Item: ({ children, to, onClick }: any) => <li role="menuitem" onClick={onClick} data-to={to}>{children}</li>,
      Divider: () => <li role="separator" />,
    }
  ),
  useTheme: () => ({ theme: { theme: 'light' }, setTheme: mockSetTheme }),
  Themes: [{ theme: 'light' }, { theme: 'dark' }],
  };
});

const openUserMenu = () => fireEvent.click(screen.getByRole('button', { name: /test user/i }));

describe('Mobile Sidebar', () => {
  beforeEach(() => {
    mockUseLayout.mockReset();
    mockLogoutRedirect.mockClear();
    mockUseLayout.mockReturnValue({ showSidebar: true, setShowSidebar: vi.fn(), secondaryNav: [] });
  });

  it('lists the navigation items', () => {
    render(<Sidebar navItems={[{ text: 'Accounts', route: '/accounts' }]} />);
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('shows the signed-in name in the identity strip', () => {
    const { container } = render(<Sidebar navItems={[]} />);
    expect(container.querySelector('.sidebar-identity')).toHaveTextContent('Test User');
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  // These are icon-only controls built for a compact horizontal strip; in a
  // column of labelled rows they read as stray marks.
  it('puts the header menu nodes in the identity strip', () => {
    const { container } = render(<Sidebar navItems={[]} menu={[<a key="s" href="/settings">Settings</a>]} />);
    const strip = container.querySelector('.sidebar-identity');
    expect(strip).toContainElement(screen.getByText('Settings'));
  });

  it('keeps the user menu closed until the identity strip is tapped', () => {
    render(<Sidebar navItems={[]} userMenu={[{ text: 'Profile', route: '/profile' }]} />);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('opens the user menu items from the identity strip', () => {
    render(<Sidebar navItems={[]} userMenu={[{ text: 'Profile', route: '/profile' }]} />);
    openUserMenu();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('offers the theme toggle in the user menu', () => {
    render(<Sidebar navItems={[]} />);
    openUserMenu();
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('signs out from the user menu', () => {
    render(<Sidebar navItems={[]} />);
    openUserMenu();
    fireEvent.click(screen.getByText('Sign out'));
    expect(mockLogoutRedirect).toHaveBeenCalledTimes(1);
  });

  it('does not repeat the user menu as rows in the navigation', () => {
    const { container } = render(<Sidebar navItems={[]} userMenu={[{ text: 'Profile', route: '/profile' }]} />);
    expect(container.querySelector('nav')).not.toHaveTextContent('Sign out');
  });
});
