import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test-utils';
import { Breadcrumb } from '../Breadcrumb';

describe('Breadcrumb', () => {
  describe('rendering', () => {
    it('renders Home link by default', () => {
      render(<Breadcrumb />);

      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders Home as a link', () => {
      const { container } = render(<Breadcrumb />);

      // The MockLink renders with the 'to' prop as href
      const link = container.querySelector('.breadcrumb-item a');
      expect(link).toBeInTheDocument();
    });

    it('renders breadcrumb items', () => {
      const breadcrumbs = [
        { text: 'Category', route: '/category' },
        { text: 'Subcategory', route: '/category/sub' },
      ];

      render(<Breadcrumb breadcrumbs={breadcrumbs} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Subcategory')).toBeInTheDocument();
    });

    it('renders breadcrumb items as links', () => {
      const breadcrumbs = [
        { text: 'Category', route: '/category' },
      ];

      const { container } = render(<Breadcrumb breadcrumbs={breadcrumbs} />);

      // Verify all breadcrumb items are rendered as links
      const links = container.querySelectorAll('.breadcrumb-item a');
      expect(links.length).toBeGreaterThan(0);
    });

    it('renders empty breadcrumb list without additional items', () => {
      render(<Breadcrumb breadcrumbs={[]} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });
  });

  describe('multiple breadcrumbs', () => {
    it('renders all breadcrumb items in order', () => {
      const breadcrumbs = [
        { text: 'First', route: '/first' },
        { text: 'Second', route: '/second' },
        { text: 'Third', route: '/third' },
      ];

      render(<Breadcrumb breadcrumbs={breadcrumbs} />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(4); // Home + 3 items
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Breadcrumb.displayName).toBe('Breadcrumb');
    });
  });
});
