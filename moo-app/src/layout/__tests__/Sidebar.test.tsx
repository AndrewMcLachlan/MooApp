import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Desktop/Sidebar';

// Mock useLayout
const mockUseLayout = vi.fn();

vi.mock('../../providers', () => ({
  useLayout: () => mockUseLayout(),
}));

// Mock moo-ds
vi.mock('@andrewmclachlan/moo-ds', () => ({
  NavItemList: ({ navItems }: { navItems: any[] }) => (
    <div data-testid="nav-items">{navItems?.length ?? 0} items</div>
  ),
  Nav: Object.assign(
    ({ children, className }: any) => (
      <nav className={className} data-testid="nav">{children}</nav>
    ),
    {
      Item: ({ children, className }: any) => (
        <div className={className} data-testid="nav-item">{children}</div>
      ),
    }
  ),
}));

// Mock classnames
vi.mock('classnames', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    mockUseLayout.mockReset();
    mockUseLayout.mockReturnValue({
      sidebarCollapsed: false,
      secondaryNav: [],
    });
  });

  describe('rendering', () => {
    it('renders sidebar element', () => {
      render(<Sidebar />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders with sidebar class', () => {
      const { container } = render(<Sidebar />);

      expect(container.querySelector('.sidebar')).toBeInTheDocument();
    });

    it('renders with sidebar id', () => {
      const { container } = render(<Sidebar />);

      expect(container.querySelector('#sidebar')).toBeInTheDocument();
    });
  });

  describe('with navItems', () => {
    it('renders nav items', () => {
      const navItems = [
        { text: 'Home', route: '/' },
        { text: 'About', route: '/about' },
      ];

      render(<Sidebar navItems={navItems} />);

      expect(screen.getByTestId('nav-items')).toHaveTextContent('2 items');
    });

    it('renders with empty navItems', () => {
      render(<Sidebar navItems={[]} />);

      expect(screen.getByTestId('nav-items')).toHaveTextContent('0 items');
    });

    it('renders with default empty navItems', () => {
      render(<Sidebar />);

      expect(screen.getByTestId('nav-items')).toHaveTextContent('0 items');
    });
  });

  describe('collapsed state', () => {
    it('does not have collapsed class when not collapsed', () => {
      mockUseLayout.mockReturnValue({
        sidebarCollapsed: false,
        secondaryNav: [],
      });

      const { container } = render(<Sidebar />);

      expect(container.querySelector('.collapsed')).not.toBeInTheDocument();
    });

    it('has collapsed class when collapsed', () => {
      mockUseLayout.mockReturnValue({
        sidebarCollapsed: true,
        secondaryNav: [],
      });

      const { container } = render(<Sidebar />);

      expect(container.querySelector('.collapsed')).toBeInTheDocument();
    });
  });

  describe('secondaryNav', () => {
    it('does not render divider when secondaryNav is empty', () => {
      mockUseLayout.mockReturnValue({
        sidebarCollapsed: false,
        secondaryNav: [],
      });

      render(<Sidebar />);

      expect(screen.queryByTestId('nav-item')).not.toBeInTheDocument();
    });

    it('renders divider and secondary nav when present', () => {
      mockUseLayout.mockReturnValue({
        sidebarCollapsed: false,
        secondaryNav: [{ text: 'Settings', route: '/settings' }],
      });

      render(<Sidebar />);

      // Should have divider nav item
      expect(screen.getByTestId('nav-item')).toHaveClass('divider');
    });

    it('renders secondary nav items', () => {
      mockUseLayout.mockReturnValue({
        sidebarCollapsed: false,
        secondaryNav: [
          { text: 'Settings', route: '/settings' },
          { text: 'Help', route: '/help' },
        ],
      });

      render(<Sidebar navItems={[{ text: 'Home', route: '/' }]} />);

      // Primary nav has 1 item, secondary has 2
      const navItemsList = screen.getAllByTestId('nav-items');
      expect(navItemsList[0]).toHaveTextContent('1 items');
      expect(navItemsList[1]).toHaveTextContent('2 items');
    });
  });

  describe('responsive classes', () => {
    it('has d-none d-lg-flex classes for desktop only', () => {
      const { container } = render(<Sidebar />);

      const sidebar = container.querySelector('#sidebar');
      expect(sidebar?.className).toContain('d-none');
      expect(sidebar?.className).toContain('d-lg-flex');
    });
  });
});
