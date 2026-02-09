import { describe, it, expect } from 'vitest';
import { Dashboard } from '../Dashboard';

describe('Dashboard', () => {
  describe('component structure', () => {
    it('exports Dashboard component', () => {
      expect(Dashboard).toBeDefined();
      expect(typeof Dashboard).toBe('function');
    });
  });
});
