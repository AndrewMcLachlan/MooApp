import { describe, it, expect } from 'vitest';
import { NotFound } from '../NotFound';

describe('NotFound', () => {
  describe('component structure', () => {
    it('exports NotFound component', () => {
      expect(NotFound).toBeDefined();
      expect(typeof NotFound).toBe('function');
    });
  });
});
