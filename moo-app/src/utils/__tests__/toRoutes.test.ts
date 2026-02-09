import { describe, it, expect } from 'vitest';
import { toRoutes } from '../toRoutes';
import { RouteDefinition } from '../../models/Route';

describe('toRoutes', () => {
  describe('basic conversion', () => {
    it('converts empty object to empty array', () => {
      const routes: RouteDefinition = {};
      const result = toRoutes(routes);

      expect(result).toEqual([]);
    });

    it('converts single route', () => {
      const routes: RouteDefinition = {
        home: {
          path: '/',
          element: 'HomePage',
        },
      };

      const result = toRoutes(routes);

      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('/');
      expect(result[0].element).toBe('HomePage');
    });

    it('converts multiple routes', () => {
      const routes: RouteDefinition = {
        home: { path: '/' },
        about: { path: '/about' },
        contact: { path: '/contact' },
      };

      const result = toRoutes(routes);

      expect(result).toHaveLength(3);
    });
  });

  describe('route properties', () => {
    it('preserves path property', () => {
      const routes: RouteDefinition = {
        users: { path: '/users/:id' },
      };

      const result = toRoutes(routes);

      expect(result[0].path).toBe('/users/:id');
    });

    it('preserves element property', () => {
      const element = { type: 'div' };
      const routes: RouteDefinition = {
        page: { path: '/', element },
      };

      const result = toRoutes(routes);

      expect(result[0].element).toBe(element);
    });

    it('preserves index property', () => {
      const routes: RouteDefinition = {
        index: { index: true },
      };

      const result = toRoutes(routes);

      expect(result[0].index).toBe(true);
    });

    it('preserves loader property', () => {
      const loader = () => Promise.resolve({ data: 'test' });
      const routes: RouteDefinition = {
        page: { path: '/', loader },
      };

      const result = toRoutes(routes);

      expect(result[0].loader).toBe(loader);
    });

    it('preserves action property', () => {
      const action = () => Promise.resolve({ success: true });
      const routes: RouteDefinition = {
        page: { path: '/', action },
      };

      const result = toRoutes(routes);

      expect(result[0].action).toBe(action);
    });

    it('preserves errorElement property', () => {
      const errorElement = { type: 'ErrorPage' };
      const routes: RouteDefinition = {
        page: { path: '/', errorElement },
      };

      const result = toRoutes(routes);

      expect(result[0].errorElement).toBe(errorElement);
    });
  });

  describe('nested routes', () => {
    it('converts nested children', () => {
      const routes: RouteDefinition = {
        parent: {
          path: '/parent',
          children: {
            child: { path: 'child' },
          },
        },
      };

      const result = toRoutes(routes);

      expect(result[0].children).toBeDefined();
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children![0].path).toBe('child');
    });

    it('converts deeply nested children', () => {
      const routes: RouteDefinition = {
        level1: {
          path: '/level1',
          children: {
            level2: {
              path: 'level2',
              children: {
                level3: { path: 'level3' },
              },
            },
          },
        },
      };

      const result = toRoutes(routes);

      expect(result[0].children![0].children![0].path).toBe('level3');
    });

    it('converts multiple nested children', () => {
      const routes: RouteDefinition = {
        parent: {
          path: '/parent',
          children: {
            child1: { path: 'child1' },
            child2: { path: 'child2' },
            child3: { path: 'child3' },
          },
        },
      };

      const result = toRoutes(routes);

      expect(result[0].children).toHaveLength(3);
    });

    it('sets children to undefined when not present', () => {
      const routes: RouteDefinition = {
        leaf: { path: '/leaf' },
      };

      const result = toRoutes(routes);

      expect(result[0].children).toBeUndefined();
    });
  });

  describe('complex scenarios', () => {
    it('handles mixed routes with and without children', () => {
      const routes: RouteDefinition = {
        home: { path: '/' },
        users: {
          path: '/users',
          children: {
            list: { path: '' },
            detail: { path: ':id' },
          },
        },
        about: { path: '/about' },
      };

      const result = toRoutes(routes);

      expect(result).toHaveLength(3);
      expect(result.find(r => r.path === '/')?.children).toBeUndefined();
      expect(result.find(r => r.path === '/users')?.children).toHaveLength(2);
      expect(result.find(r => r.path === '/about')?.children).toBeUndefined();
    });

    it('preserves all properties in nested routes', () => {
      const loader = () => Promise.resolve({});
      const routes: RouteDefinition = {
        parent: {
          path: '/parent',
          element: 'ParentElement',
          children: {
            child: {
              path: 'child',
              element: 'ChildElement',
              loader,
            },
          },
        },
      };

      const result = toRoutes(routes);

      expect(result[0].element).toBe('ParentElement');
      expect(result[0].children![0].element).toBe('ChildElement');
      expect(result[0].children![0].loader).toBe(loader);
    });
  });
});
