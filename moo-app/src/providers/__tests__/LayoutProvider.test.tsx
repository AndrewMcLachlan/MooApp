import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import React from 'react';
import { LayoutProvider, useLayout } from '../LayoutProvider';

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
  usePhoto: () => 'data:image/png;base64,mockphoto',
}));

// Mock useLocalStorage
vi.mock('@andrewmclachlan/moo-ds', () => ({
  useLocalStorage: (key: string, initial: boolean) => {
    const [value, setValue] = React.useState(initial);
    return [value, setValue];
  },
  NavItem: () => null,
}));

describe('LayoutProvider', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <LayoutProvider size="default">
          <div data-testid="child">Content</div>
        </LayoutProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(LayoutProvider.displayName).toBe('LayoutProvider');
    });
  });

  describe('context values', () => {
    it('provides size from props', () => {
      const TestConsumer = () => {
        const { size } = useLayout();
        return <div data-testid="size">{size}</div>;
      };

      render(
        <LayoutProvider size="small">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('size')).toHaveTextContent('small');
    });

    it('provides default size', () => {
      const TestConsumer = () => {
        const { size } = useLayout();
        return <div data-testid="size">{size}</div>;
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('size')).toHaveTextContent('default');
    });

    it('provides photo from usePhoto hook', () => {
      const TestConsumer = () => {
        const { photo } = useLayout();
        return <div data-testid="photo">{photo}</div>;
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('photo')).toHaveTextContent('data:image/png;base64,mockphoto');
    });
  });

  describe('breadcrumbs state', () => {
    it('provides empty breadcrumbs initially', () => {
      const TestConsumer = () => {
        const { breadcrumbs } = useLayout();
        return <div data-testid="count">{breadcrumbs?.length ?? 0}</div>;
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('allows setting breadcrumbs', () => {
      const TestConsumer = () => {
        const { breadcrumbs, setBreadcrumbs } = useLayout();
        return (
          <div>
            <div data-testid="count">{breadcrumbs?.length ?? 0}</div>
            <button onClick={() => setBreadcrumbs?.([{ text: 'Home', route: '/' }])}>
              Set
            </button>
          </div>
        );
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByText('Set').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('sidebar state', () => {
    it('provides showSidebar state', () => {
      const TestConsumer = () => {
        const { showSidebar } = useLayout();
        return <div data-testid="show">{showSidebar ? 'yes' : 'no'}</div>;
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('show')).toHaveTextContent('no');
    });

    it('allows toggling showSidebar', () => {
      const TestConsumer = () => {
        const { showSidebar, setShowSidebar } = useLayout();
        return (
          <div>
            <div data-testid="show">{showSidebar ? 'yes' : 'no'}</div>
            <button onClick={() => setShowSidebar?.(true)}>Show</button>
          </div>
        );
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByText('Show').click();
      });

      expect(screen.getByTestId('show')).toHaveTextContent('yes');
    });

    it('provides sidebarCollapsed state', () => {
      const TestConsumer = () => {
        const { sidebarCollapsed } = useLayout();
        return <div data-testid="collapsed">{sidebarCollapsed ? 'yes' : 'no'}</div>;
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('collapsed')).toHaveTextContent('no');
    });
  });

  describe('actions state', () => {
    it('provides empty actions initially', () => {
      const TestConsumer = () => {
        const { actions } = useLayout();
        return <div data-testid="count">{actions?.length ?? 0}</div>;
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('allows setting actions', () => {
      const TestConsumer = () => {
        const { actions, setActions } = useLayout();
        return (
          <div>
            <div data-testid="count">{actions?.length ?? 0}</div>
            <button onClick={() => setActions?.([<span key="1">Action</span>])}>
              Set
            </button>
          </div>
        );
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByText('Set').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('secondaryNav state', () => {
    it('provides empty secondaryNav initially', () => {
      const TestConsumer = () => {
        const { secondaryNav } = useLayout();
        return <div data-testid="count">{secondaryNav?.length ?? 0}</div>;
      };

      render(
        <LayoutProvider size="default">
          <TestConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });
});

describe('useLayout', () => {
  it('returns default context outside provider', () => {
    const { result } = renderHook(() => useLayout());

    expect(result.current.size).toBe('default');
  });

  it('returns full context inside provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LayoutProvider size="small">{children}</LayoutProvider>
    );

    const { result } = renderHook(() => useLayout(), { wrapper });

    expect(result.current.size).toBe('small');
    expect(result.current.setBreadcrumbs).toBeDefined();
    expect(result.current.setActions).toBeDefined();
    expect(result.current.setShowSidebar).toBeDefined();
  });
});
