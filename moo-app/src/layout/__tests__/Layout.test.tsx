import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Layout } from '../Layout';

// Mock MSAL
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      getActiveAccount: () => ({ username: 'test@example.com', name: 'Test User' }),
    },
    accounts: [],
    inProgress: 'none',
  }),
}));

// Mock usePhoto service
vi.mock('../../services', () => ({
  usePhoto: () => null,
}));

// Mock moo-ds components
vi.mock('@andrewmclachlan/moo-ds', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocalStorage: (key: string, initial: any) => [initial, vi.fn()],
  NavItemList: () => null,
  Breadcrumb: () => <div data-testid="breadcrumb">Breadcrumb</div>,
  MenuToggle: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="menu-toggle" onClick={onClick}>Toggle</button>
  ),
}));

// Mock react-bootstrap
vi.mock('react-bootstrap', () => ({
  Container: ({ children, className }: any) => (
    <div className={className} data-testid="container">{children}</div>
  ),
  Nav: Object.assign(
    ({ children, className }: any) => <nav className={className}>{children}</nav>,
    { Item: ({ children }: any) => <div>{children}</div> }
  ),
}));

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe('Layout', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Layout>
          <div data-testid="child">Content</div>
        </Layout>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders with app-container class', () => {
      const { container } = render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.querySelector('.app-container')).toBeInTheDocument();
    });

    it('applies default size class', () => {
      const { container } = render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.querySelector('.moo-default')).toBeInTheDocument();
    });

    it('applies small size class', () => {
      const { container } = render(
        <Layout size="small">
          <div>Content</div>
        </Layout>
      );

      expect(container.querySelector('.moo-small')).toBeInTheDocument();
    });
  });

  describe('compound components', () => {
    it('has Footer component', () => {
      expect(Layout.Footer).toBeDefined();
    });

    it('has MobileFooter component', () => {
      expect(Layout.MobileFooter).toBeDefined();
    });

    it('has Header component', () => {
      expect(Layout.Header).toBeDefined();
    });

    it('has MobileHeader component', () => {
      expect(Layout.MobileHeader).toBeDefined();
    });

    it('has Sidebar component', () => {
      expect(Layout.Sidebar).toBeDefined();
    });

    it('has MobileSidebar component', () => {
      expect(Layout.MobileSidebar).toBeDefined();
    });
  });

  describe('with size prop', () => {
    it('accepts default size', () => {
      const { container } = render(
        <Layout size="default">
          <div>Content</div>
        </Layout>
      );

      expect(container.querySelector('.moo-default')).toBeInTheDocument();
    });

    it('accepts small size', () => {
      const { container } = render(
        <Layout size="small">
          <div>Content</div>
        </Layout>
      );

      expect(container.querySelector('.moo-small')).toBeInTheDocument();
    });
  });
});
