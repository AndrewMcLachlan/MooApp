import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import { NavItemList } from '../NavItemList';
import { NavItem } from '../../models';

describe('NavItemList', () => {
  describe('rendering with route items', () => {
    it('renders nav items with routes', () => {
      const navItems: NavItem[] = [
        { text: 'Home', route: '/' },
        { text: 'About', route: '/about' },
      ];

      render(<NavItemList navItems={navItems} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('renders links with correct href', () => {
      const navItems: NavItem[] = [
        { text: 'Home', route: '/home' },
      ];

      render(<NavItemList navItems={navItems} />);

      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home');
    });
  });

  describe('rendering with onClick items', () => {
    it('renders items with onClick handlers as buttons', () => {
      const onClick = vi.fn();
      const navItems: NavItem[] = [
        { text: 'Action', onClick },
      ];

      render(<NavItemList navItems={navItems} />);

      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      const navItems: NavItem[] = [
        { text: 'Action', onClick },
      ];

      render(<NavItemList navItems={navItems} />);

      fireEvent.click(screen.getByText('Action'));

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('rendering with images', () => {
    it('renders string image as img element', () => {
      const navItems: NavItem[] = [
        { text: 'With Image', route: '/', image: '/icon.png' },
      ];

      const { container } = render(<NavItemList navItems={navItems} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/icon.png');
    });

    it('renders ReactNode image directly', () => {
      const navItems: NavItem[] = [
        { text: 'With Icon', route: '/', image: <span data-testid="custom-icon">Icon</span> },
      ];

      render(<NavItemList navItems={navItems} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('rendering React nodes', () => {
    it('renders React nodes as-is', () => {
      const navItems = [
        <span key="custom" data-testid="custom-element">Custom</span>,
      ];

      render(<NavItemList navItems={navItems} />);

      expect(screen.getByTestId('custom-element')).toBeInTheDocument();
    });
  });

  describe('as prop', () => {
    it('uses Fragment by default', () => {
      const navItems: NavItem[] = [
        { text: 'Item', route: '/' },
      ];

      const { container } = render(<NavItemList navItems={navItems} />);

      // Without a wrapper, items should render without extra wrapper elements
      expect(container.querySelector('a')).toBeInTheDocument();
    });

    it('uses custom wrapper element', () => {
      const navItems: NavItem[] = [
        { text: 'Item', route: '/' },
      ];

      const { container } = render(<NavItemList navItems={navItems} as="li" />);

      expect(container.querySelector('li')).toBeInTheDocument();
    });
  });

  describe('role prop', () => {
    it('passes role to nav links', () => {
      const navItems: NavItem[] = [
        { text: 'Item', route: '/' },
      ];

      render(<NavItemList navItems={navItems} role="menuitem" />);

      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });
  });

  describe('onClick prop', () => {
    it('calls parent onClick when nav item is clicked', () => {
      const parentClick = vi.fn();
      const navItems: NavItem[] = [
        { text: 'Item', route: '/' },
      ];

      render(<NavItemList navItems={navItems} onClick={parentClick} />);

      fireEvent.click(screen.getByText('Item'));

      expect(parentClick).toHaveBeenCalled();
    });
  });

  describe('active state', () => {
    it('renders nav item as link', () => {
      const navItems: NavItem[] = [
        { id: '1', text: 'Home', route: '/' },
      ];

      render(<NavItemList navItems={navItems} />);

      const link = screen.getByText('Home').closest('a');
      expect(link).toBeInTheDocument();
    });
  });
});
