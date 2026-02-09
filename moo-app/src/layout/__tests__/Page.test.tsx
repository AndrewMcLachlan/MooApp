import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Page } from '../Page';

// Mock MSAL
const mockIsAuthenticated = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useIsAuthenticated: () => mockIsAuthenticated(),
}));

// Mock useLayout
const mockSetBreadcrumbs = vi.fn();
const mockSetSecondaryNav = vi.fn();
const mockSetActions = vi.fn();

vi.mock('../../providers', () => ({
  useLayout: () => ({
    setBreadcrumbs: mockSetBreadcrumbs,
    setSecondaryNav: mockSetSecondaryNav,
    setActions: mockSetActions,
  }),
}));

// Mock useApp for usePageTitle
vi.mock('../../providers/AppProvider', () => ({
  useApp: () => ({ name: 'Test App' }),
}));

describe('Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(true);
    document.title = '';
  });

  describe('rendering', () => {
    it('renders children when authenticated', () => {
      render(
        <Page title="Test Page">
          <div data-testid="page-content">Content</div>
        </Page>
      );

      expect(screen.getByTestId('page-content')).toBeInTheDocument();
    });

    it('does not render children when not authenticated', () => {
      mockIsAuthenticated.mockReturnValue(false);

      render(
        <Page title="Test Page">
          <div data-testid="page-content">Content</div>
        </Page>
      );

      expect(screen.queryByTestId('page-content')).not.toBeInTheDocument();
    });

    it('renders as main element', () => {
      const { container } = render(<Page title="Test Page">Content</Page>);

      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('applies container-fluid class', () => {
      const { container } = render(<Page title="Test Page">Content</Page>);

      expect(container.querySelector('.container-fluid')).toBeInTheDocument();
    });

    it('passes through additional HTML attributes', () => {
      const { container } = render(
        <Page title="Test Page" className="custom-class" id="custom-id">
          Content
        </Page>
      );

      const main = container.querySelector('main');
      expect(main).toHaveClass('custom-class');
      expect(main).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('page title', () => {
    it('sets document title', () => {
      render(<Page title="Dashboard">Content</Page>);

      expect(document.title).toBe('Dashboard : Test App');
    });

    it('updates document title on rerender', () => {
      const { rerender } = render(<Page title="Page 1">Content</Page>);

      expect(document.title).toBe('Page 1 : Test App');

      rerender(<Page title="Page 2">Content</Page>);

      expect(document.title).toBe('Page 2 : Test App');
    });
  });

  describe('breadcrumbs', () => {
    it('sets breadcrumbs when provided', () => {
      const breadcrumbs = [
        { text: 'Home', to: '/' },
        { text: 'Dashboard', to: '/dashboard' },
      ];

      render(<Page title="Test" breadcrumbs={breadcrumbs}>Content</Page>);

      expect(mockSetBreadcrumbs).toHaveBeenCalledWith(breadcrumbs);
    });

    it('sets empty breadcrumbs when not provided', () => {
      render(<Page title="Test">Content</Page>);

      expect(mockSetBreadcrumbs).toHaveBeenCalledWith([]);
    });

    it('updates breadcrumbs on change', () => {
      const { rerender } = render(
        <Page title="Test" breadcrumbs={[{ text: 'Home', to: '/' }]}>
          Content
        </Page>
      );

      const newBreadcrumbs = [{ text: 'About', to: '/about' }];
      rerender(<Page title="Test" breadcrumbs={newBreadcrumbs}>Content</Page>);

      expect(mockSetBreadcrumbs).toHaveBeenLastCalledWith(newBreadcrumbs);
    });
  });

  describe('secondary nav', () => {
    it('sets secondary nav items when provided', () => {
      const navItems = [
        { text: 'Overview', to: '/overview' },
        { text: 'Settings', to: '/settings' },
      ];

      render(<Page title="Test" navItems={navItems}>Content</Page>);

      expect(mockSetSecondaryNav).toHaveBeenCalledWith(navItems);
    });

    it('sets empty nav items when not provided', () => {
      render(<Page title="Test">Content</Page>);

      expect(mockSetSecondaryNav).toHaveBeenCalledWith([]);
    });

    it('accepts ReactNode nav items', () => {
      const navItems = [<button key="1">Custom</button>];

      render(<Page title="Test" navItems={navItems}>Content</Page>);

      expect(mockSetSecondaryNav).toHaveBeenCalledWith(navItems);
    });
  });

  describe('actions', () => {
    it('sets actions when provided', () => {
      const actions = [<button key="1">Save</button>, <button key="2">Cancel</button>];

      render(<Page title="Test" actions={actions}>Content</Page>);

      expect(mockSetActions).toHaveBeenCalledWith(actions);
    });

    it('sets empty actions when not provided', () => {
      render(<Page title="Test">Content</Page>);

      expect(mockSetActions).toHaveBeenCalledWith([]);
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Page.displayName).toBe('Page');
    });
  });
});
