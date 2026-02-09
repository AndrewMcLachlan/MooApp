import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Header } from '../Desktop/Header';

// Mock useLayout and useApp
const mockSetSidebarCollapsed = vi.fn();
const mockUseLayout = vi.fn();
const mockUseApp = vi.fn();

vi.mock('../../providers', () => ({
  useLayout: () => mockUseLayout(),
  useApp: () => mockUseApp(),
}));

// Mock moo-ds
vi.mock('@andrewmclachlan/moo-ds', () => ({
  Breadcrumb: ({ breadcrumbs }: { breadcrumbs: any[] }) => (
    <div data-testid="breadcrumb">{breadcrumbs?.length ?? 0} crumbs</div>
  ),
  MenuToggle: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="menu-toggle" onClick={onClick}>Toggle</button>
  ),
}));

// Mock react-bootstrap
vi.mock('react-bootstrap', () => ({
  Container: ({ children, className }: any) => (
    <div className={className} data-testid="container">{children}</div>
  ),
}));

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className} data-testid="link">{children}</a>
  ),
}));

// Mock UserMenu
vi.mock('../UserMenu', () => ({
  UserMenu: ({ userMenu }: any) => (
    <div data-testid="user-menu">{userMenu?.length ?? 0} menu items</div>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    mockSetSidebarCollapsed.mockClear();
    mockUseLayout.mockReset();
    mockUseApp.mockReset();

    mockUseLayout.mockReturnValue({
      size: 'default',
      breadcrumbs: [],
      actions: null,
      sidebarCollapsed: false,
      setSidebarCollapsed: mockSetSidebarCollapsed,
    });

    mockUseApp.mockReturnValue({
      name: 'Test App',
    });
  });

  describe('rendering', () => {
    it('renders header element', () => {
      render(<Header menu={[]} />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders with d-none d-lg-block classes for desktop only', () => {
      render(<Header menu={[]} />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('d-none');
      expect(header).toHaveClass('d-lg-block');
    });
  });

  describe('logo', () => {
    it('renders logo link to home', () => {
      render(<Header menu={[]} />);

      const link = screen.getByTestId('link');
      expect(link).toHaveAttribute('href', '/');
    });

    it('renders logo image with app name alt text', () => {
      render(<Header menu={[]} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Test App home');
      expect(img).toHaveAttribute('src', '/logo.svg');
    });

    it('uses 80px height for default size', () => {
      mockUseLayout.mockReturnValue({
        size: 'default',
        breadcrumbs: [],
        actions: null,
        sidebarCollapsed: false,
        setSidebarCollapsed: mockSetSidebarCollapsed,
      });

      render(<Header menu={[]} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('height', '80');
    });

    it('uses 40px height for small size', () => {
      mockUseLayout.mockReturnValue({
        size: 'small',
        breadcrumbs: [],
        actions: null,
        sidebarCollapsed: false,
        setSidebarCollapsed: mockSetSidebarCollapsed,
      });

      render(<Header menu={[]} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('height', '40');
    });
  });

  describe('search', () => {
    it('renders search prop in search div', () => {
      render(
        <Header
          menu={[]}
          search={<input data-testid="search-input" />}
        />
      );

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('renders empty search div when no search prop', () => {
      const { container } = render(<Header menu={[]} />);

      expect(container.querySelector('.search')).toBeInTheDocument();
    });
  });

  describe('menu', () => {
    it('renders menu items', () => {
      const menu = [
        <span key="1">Item 1</span>,
        <span key="2">Item 2</span>,
      ];

      render(<Header menu={menu} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders empty menu', () => {
      render(<Header menu={[]} />);

      const nav = screen.getByRole('navigation');
      expect(nav.querySelector('ul')).toBeInTheDocument();
    });
  });

  describe('user menu', () => {
    it('renders UserMenu component', () => {
      render(<Header menu={[]} />);

      expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    });

    it('passes userMenu prop to UserMenu', () => {
      const userMenu = [
        { text: 'Profile', route: '/profile' },
      ];

      render(<Header menu={[]} userMenu={userMenu} />);

      expect(screen.getByTestId('user-menu')).toHaveTextContent('1 menu items');
    });
  });

  describe('second header', () => {
    it('renders menu toggle', () => {
      render(<Header menu={[]} />);

      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
    });

    it('toggles sidebar on menu toggle click', () => {
      render(<Header menu={[]} />);

      fireEvent.click(screen.getByTestId('menu-toggle'));

      expect(mockSetSidebarCollapsed).toHaveBeenCalledWith(true);
    });

    it('toggles sidebar collapsed state correctly', () => {
      mockUseLayout.mockReturnValue({
        size: 'default',
        breadcrumbs: [],
        actions: null,
        sidebarCollapsed: true,
        setSidebarCollapsed: mockSetSidebarCollapsed,
      });

      render(<Header menu={[]} />);

      fireEvent.click(screen.getByTestId('menu-toggle'));

      expect(mockSetSidebarCollapsed).toHaveBeenCalledWith(false);
    });

    it('renders breadcrumbs', () => {
      mockUseLayout.mockReturnValue({
        size: 'default',
        breadcrumbs: [{ text: 'Home', route: '/' }],
        actions: null,
        sidebarCollapsed: false,
        setSidebarCollapsed: mockSetSidebarCollapsed,
      });

      render(<Header menu={[]} />);

      expect(screen.getByTestId('breadcrumb')).toHaveTextContent('1 crumbs');
    });

    it('renders actions', () => {
      mockUseLayout.mockReturnValue({
        size: 'default',
        breadcrumbs: [],
        actions: <button data-testid="action-btn">Action</button>,
        sidebarCollapsed: false,
        setSidebarCollapsed: mockSetSidebarCollapsed,
      });

      render(<Header menu={[]} />);

      expect(screen.getByTestId('action-btn')).toBeInTheDocument();
    });
  });

  describe('containers', () => {
    it('renders first-header container', () => {
      render(<Header menu={[]} />);

      const containers = screen.getAllByTestId('container');
      expect(containers[0]).toHaveClass('first-header');
    });

    it('renders second-header container', () => {
      render(<Header menu={[]} />);

      const containers = screen.getAllByTestId('container');
      expect(containers[1]).toHaveClass('second-header');
    });
  });
});
