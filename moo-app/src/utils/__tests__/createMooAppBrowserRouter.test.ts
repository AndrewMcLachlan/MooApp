import { describe, it, expect, vi } from 'vitest';
import { createMooAppBrowserRouter } from '../createMooAppBrowserRouter';
import { RouteDefinition } from '../../models/Route';

// Mock react-router's createBrowserRouter
vi.mock('react-router', () => ({
  createBrowserRouter: vi.fn((routes) => ({
    routes,
    _isMockRouter: true,
  })),
}));

describe('createMooAppBrowserRouter', () => {
  it('creates a browser router from route definition', () => {
    const routes: RouteDefinition = {
      home: { path: '/' },
    };

    const router = createMooAppBrowserRouter(routes);

    expect(router).toBeDefined();
    expect((router as any)._isMockRouter).toBe(true);
  });

  it('passes converted routes to createBrowserRouter', () => {
    const routes: RouteDefinition = {
      home: { path: '/' },
      about: { path: '/about' },
    };

    const router = createMooAppBrowserRouter(routes);

    expect((router as any).routes).toHaveLength(2);
  });

  it('handles nested routes', () => {
    const routes: RouteDefinition = {
      dashboard: {
        path: '/dashboard',
        children: {
          overview: { path: '' },
          settings: { path: 'settings' },
        },
      },
    };

    const router = createMooAppBrowserRouter(routes);

    expect((router as any).routes[0].children).toHaveLength(2);
  });

  it('handles empty routes', () => {
    const routes: RouteDefinition = {};

    const router = createMooAppBrowserRouter(routes);

    expect((router as any).routes).toEqual([]);
  });

  it('preserves route element', () => {
    const element = { type: 'HomePage' };
    const routes: RouteDefinition = {
      home: { path: '/', element },
    };

    const router = createMooAppBrowserRouter(routes);

    expect((router as any).routes[0].element).toBe(element);
  });

  it('preserves route loader', () => {
    const loader = () => Promise.resolve({ data: 'test' });
    const routes: RouteDefinition = {
      home: { path: '/', loader },
    };

    const router = createMooAppBrowserRouter(routes);

    expect((router as any).routes[0].loader).toBe(loader);
  });
});
