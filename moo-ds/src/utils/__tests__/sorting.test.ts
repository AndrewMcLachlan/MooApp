import { describe, it, expect } from 'vitest';
import { changeSortDirection } from '../sorting';
import type { SortDirection } from '../../models';

describe('sorting', () => {
  describe('changeSortDirection', () => {
    it('changes Ascending to Descending', () => {
      const result = changeSortDirection('Ascending');
      expect(result).toBe('Descending');
    });

    it('changes Descending to Ascending', () => {
      const result = changeSortDirection('Descending');
      expect(result).toBe('Ascending');
    });

    it('returns correct type', () => {
      const result: SortDirection = changeSortDirection('Ascending');
      expect(['Ascending', 'Descending']).toContain(result);
    });

    it('toggles back and forth', () => {
      let direction: SortDirection = 'Ascending';

      direction = changeSortDirection(direction);
      expect(direction).toBe('Descending');

      direction = changeSortDirection(direction);
      expect(direction).toBe('Ascending');

      direction = changeSortDirection(direction);
      expect(direction).toBe('Descending');
    });
  });
});
