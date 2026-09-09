import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

vi.mock('@andrewmclachlan/moo-ds', () => ({
  Drawer: Object.assign(
    ({ children }: any) => <div data-testid="drawer">{children}</div>,
    {
      Header: ({ children }: any) => <div>{children}</div>,
      Body: ({ children }: any) => <div>{children}</div>,
    }
  ),
  Nav: Object.assign(
    ({ children }: any) => <nav>{children}</nav>,
    { Item: ({ children, className }: any) => <div className={className}>{children}</div> }
  ),
  NavItemList: ({ navItems }: { navItems: any[] }) => (
    <ul>{navItems?.map((item: any, i: number) => <li key={i}>{item.text}</li>)}</ul>
  ),
  useTheme: () => ({ theme: { theme: 'light' }, setTheme: mockSetTheme }),
  Themes: [{ theme: 'light' }, { theme: 'dark' }],
}));

describe('Mobile Sidebar', () => {
  beforeEach(() => {
    mockUseLayout.mockReset();
    mockUseLayout.mockReturnValue({ showSidebar: true, setShowSidebar: vi.fn(), secondaryNav: [] });
  });

  it('lists the navigation items', () => {
    render(<Sidebar navItems={[{ text: 'Accounts', route: '/accounts' }]} />);
    expect(screen.getByText('Accounts')).toBeInTheDocument();
  });

  it('lists the user menu items', () => {
    render(<Sidebar navItems={[]} userMenu={[{ text: 'Profile', route: '/profile' }]} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders the header menu nodes', () => {
    render(<Sidebar navItems={[]} menu={[<a key="s" href="/settings">Settings</a>]} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('offers sign out', () => {
    render(<Sidebar navItems={[]} />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('offers a theme toggle', () => {
    render(<Sidebar navItems={[]} />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });
});
