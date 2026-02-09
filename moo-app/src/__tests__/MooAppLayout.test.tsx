import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MooAppLayout } from '../MooAppLayout';

// Mock react-router
vi.mock('react-router', () => ({
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  useLocation: () => ({ pathname: '/test' }),
}));

// Mock react-error-boundary
vi.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

// Mock moo-ds
vi.mock('@andrewmclachlan/moo-ds', () => ({
  Alerts: () => <div data-testid="alerts">Alerts</div>,
  Notifications: () => <div data-testid="notifications">Notifications</div>,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocalStorage: (key: string, initial: any) => [initial, vi.fn()],
}));

// Mock Layout component
vi.mock('../layout/Layout', () => ({
  Layout: Object.assign(
    ({ children, size }: { children: React.ReactNode; size: string }) => (
      <div data-testid="layout" data-size={size}>{children}</div>
    ),
    {
      Header: (props: any) => <div data-testid="header">Header</div>,
      MobileHeader: (props: any) => <div data-testid="mobile-header">Mobile Header</div>,
      Sidebar: (props: any) => <div data-testid="sidebar">Sidebar</div>,
      MobileSidebar: (props: any) => <div data-testid="mobile-sidebar">Mobile Sidebar</div>,
    }
  ),
}));

// Mock Error page
vi.mock('../pages/Error', () => ({
  Error: () => <div data-testid="error-page">Error Page</div>,
}));

describe('MooAppLayout', () => {
  const defaultProps = {
    header: {
      menu: [],
      userMenu: [],
    },
    sidebar: {
      navItems: [],
    },
  };

  describe('rendering', () => {
    it('renders Layout component', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('renders with small size', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('layout')).toHaveAttribute('data-size', 'small');
    });
  });

  describe('alerts and notifications', () => {
    it('renders Alerts component', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('alerts')).toBeInTheDocument();
    });

    it('renders Notifications component', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('notifications')).toBeInTheDocument();
    });
  });

  describe('header components', () => {
    it('renders Header component', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders MobileHeader component', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
    });
  });

  describe('sidebar components', () => {
    it('renders Sidebar component', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('renders MobileSidebar component', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    });
  });

  describe('error boundary', () => {
    it('renders ErrorBoundary around Outlet', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    });

    it('renders Outlet inside ErrorBoundary', () => {
      render(<MooAppLayout {...defaultProps} />);

      const errorBoundary = screen.getByTestId('error-boundary');
      expect(errorBoundary).toContainElement(screen.getByTestId('outlet'));
    });
  });

  describe('outlet', () => {
    it('renders Outlet for child routes', () => {
      render(<MooAppLayout {...defaultProps} />);

      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
  });

  describe('with props', () => {
    it('accepts header props', () => {
      const headerProps = {
        menu: [<span key="1">Menu Item</span>],
        userMenu: [{ text: 'Profile', route: '/profile' }],
        search: <input placeholder="Search" />,
      };

      render(
        <MooAppLayout
          header={headerProps}
          sidebar={defaultProps.sidebar}
        />
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('accepts sidebar props', () => {
      const sidebarProps = {
        navItems: [
          { text: 'Home', route: '/' },
          { text: 'About', route: '/about' },
        ],
      };

      render(
        <MooAppLayout
          header={defaultProps.header}
          sidebar={sidebarProps}
        />
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });
});
