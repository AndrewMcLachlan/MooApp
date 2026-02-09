import { describe, it, expect } from 'vitest';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  describe('component structure', () => {
    it('exports Avatar component', () => {
      expect(Avatar).toBeDefined();
      expect(typeof Avatar).toBe('function');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Avatar.displayName).toBe('Avatar');
    });
  });
});
