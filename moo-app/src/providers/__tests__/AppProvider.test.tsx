import { describe, it, expect } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import React from 'react';
import { AppProvider, AppContext, useApp } from '../AppProvider';

describe('AppProvider', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <AppProvider name="Test App" version="1.0.0">
          <div data-testid="child">Content</div>
        </AppProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <AppProvider name="Test App" version="1.0.0">
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </AppProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(AppProvider.displayName).toBe('AppProvider');
    });
  });

  describe('context value', () => {
    it('provides name to children', () => {
      const TestConsumer = () => {
        const app = useApp();
        return <div data-testid="name">{app.name}</div>;
      };

      render(
        <AppProvider name="My Application" version="1.0.0">
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('name')).toHaveTextContent('My Application');
    });

    it('provides version to children', () => {
      const TestConsumer = () => {
        const app = useApp();
        return <div data-testid="version">{app.version}</div>;
      };

      render(
        <AppProvider name="App" version="2.5.0">
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('version')).toHaveTextContent('2.5.0');
    });

    it('provides copyrightYear when specified', () => {
      const TestConsumer = () => {
        const app = useApp();
        return <div data-testid="year">{app.copyrightYear}</div>;
      };

      render(
        <AppProvider name="App" version="1.0.0" copyrightYear={2024}>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('year')).toHaveTextContent('2024');
    });

    it('copyrightYear is undefined when not provided', () => {
      const TestConsumer = () => {
        const app = useApp();
        return <div data-testid="year">{app.copyrightYear ?? 'undefined'}</div>;
      };

      render(
        <AppProvider name="App" version="1.0.0">
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('year')).toHaveTextContent('undefined');
    });
  });
});

describe('useApp', () => {
  it('throws error outside provider', () => {
    expect(() => renderHook(() => useApp())).toThrow("useApp must be used within an AppProvider");
  });

  it('returns app options inside provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider name="Test App" version="1.0.0" copyrightYear={2024}>
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.name).toBe('Test App');
    expect(result.current.version).toBe('1.0.0');
    expect(result.current.copyrightYear).toBe(2024);
  });

  it('returns all app properties', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider name="Full App" version="3.2.1" copyrightYear={2023}>
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current).toEqual({
      name: 'Full App',
      version: '3.2.1',
      copyrightYear: 2023,
    });
  });
});

describe('AppContext', () => {
  it('is exported', () => {
    expect(AppContext).toBeDefined();
  });

  it('can be used with useContext directly', () => {
    const TestConsumer = () => {
      const context = React.useContext(AppContext);
      return <div data-testid="context">{context?.name ?? 'no context'}</div>;
    };

    render(
      <AppProvider name="Direct Context" version="1.0.0">
        <TestConsumer />
      </AppProvider>
    );

    expect(screen.getByTestId('context')).toHaveTextContent('Direct Context');
  });

  it('returns undefined when used outside provider', () => {
    const TestConsumer = () => {
      const context = React.useContext(AppContext);
      return <div data-testid="context">{context?.name ?? 'no context'}</div>;
    };

    render(<TestConsumer />);

    expect(screen.getByTestId('context')).toHaveTextContent('no context');
  });
});
