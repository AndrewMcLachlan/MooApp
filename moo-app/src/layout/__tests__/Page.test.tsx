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
        { text: 'Home', route: '/' },
        { text: 'Dashboard', route: '/dashboard' },
      ];

      render(<Page title="Test" breadcrumbs={breadcrumbs}>Content</Page>);

      expect(mockSetBreadcrumbs).toHaveBeenCalledWith(breadcrumbs);
    });

    it('sets empty breadcrumbs when not provided', () => {
      render(<Page title="Test">Content</Page>);

      expect(mockSetBreadcrumbs).toHaveBeenCalledWith([]);
    });

    it('does not call setBreadcrumbs again when re-rendered with the same content', () => {
      const { rerender } = render(
        <Page title="Test" breadcrumbs={[{ text: 'Home', route: '/' }]}>
          Content
        </Page>
      );

      expect(mockSetBreadcrumbs).toHaveBeenCalledTimes(1);

      // New array literal, identical content: the content guard should skip the setter.
      rerender(
        <Page title="Test" breadcrumbs={[{ text: 'Home', route: '/' }]}>
          Content
        </Page>
      );

      expect(mockSetBreadcrumbs).toHaveBeenCalledTimes(1);
    });

    it('updates breadcrumbs on change', () => {
      const { rerender } = render(
        <Page title="Test" breadcrumbs={[{ text: 'Home', route: '/' }]}>
          Content
        </Page>
      );

      const newBreadcrumbs = [{ text: 'About', route: '/about' }];
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

    it('does not call setSecondaryNav again when re-rendered with the same reference', () => {
      const navItems = [{ text: 'Overview', to: '/overview' }];
      const { rerender } = render(<Page title="Test" navItems={navItems}>Content</Page>);

      expect(mockSetSecondaryNav).toHaveBeenCalledTimes(1);

      rerender(<Page title="Test" navItems={navItems}>Content</Page>);

      expect(mockSetSecondaryNav).toHaveBeenCalledTimes(1);
    });

    it('updates setSecondaryNav when a new ReactNode array reference is passed', () => {
      const { rerender } = render(
        <Page title="Test" navItems={[<button key="1">A</button>]}>Content</Page>
      );

      expect(mockSetSecondaryNav).toHaveBeenCalledTimes(1);

      rerender(<Page title="Test" navItems={[<button key="2">B</button>]}>Content</Page>);

      expect(mockSetSecondaryNav).toHaveBeenCalledTimes(2);
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

    it('does not call setActions again when re-rendered with the same reference', () => {
      const actions = [<button key="1">Save</button>];
      const { rerender } = render(<Page title="Test" actions={actions}>Content</Page>);

      expect(mockSetActions).toHaveBeenCalledTimes(1);

      rerender(<Page title="Test" actions={actions}>Content</Page>);

      expect(mockSetActions).toHaveBeenCalledTimes(1);
    });

    it('updates setActions when a new array reference is passed', () => {
      const { rerender } = render(
        <Page title="Test" actions={[<button key="1">Save</button>]}>Content</Page>
      );

      expect(mockSetActions).toHaveBeenCalledTimes(1);

      rerender(<Page title="Test" actions={[<button key="2">Delete</button>]}>Content</Page>);

      expect(mockSetActions).toHaveBeenCalledTimes(2);
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Page.displayName).toBe('Page');
    });
  });
});
