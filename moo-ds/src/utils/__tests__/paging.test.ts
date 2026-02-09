import { describe, it, expect } from 'vitest';
import { getPagesToDisplay, getNumberOfPages } from '../paging';

describe('paging', () => {
  describe('getNumberOfPages', () => {
    it('calculates exact division correctly', () => {
      expect(getNumberOfPages(100, 10)).toBe(10);
      expect(getNumberOfPages(50, 50)).toBe(1);
      expect(getNumberOfPages(200, 20)).toBe(10);
    });

    it('rounds up for partial pages', () => {
      expect(getNumberOfPages(101, 10)).toBe(11);
      expect(getNumberOfPages(99, 10)).toBe(10);
      expect(getNumberOfPages(1, 10)).toBe(1);
    });

    it('returns at least 1 page for zero items', () => {
      expect(getNumberOfPages(0, 10)).toBe(1);
    });

    it('handles single item', () => {
      expect(getNumberOfPages(1, 10)).toBe(1);
      expect(getNumberOfPages(1, 1)).toBe(1);
    });

    it('handles page size of 1', () => {
      expect(getNumberOfPages(5, 1)).toBe(5);
      expect(getNumberOfPages(100, 1)).toBe(100);
    });

    it('handles large numbers', () => {
      expect(getNumberOfPages(1000000, 100)).toBe(10000);
      expect(getNumberOfPages(999, 100)).toBe(10);
    });
  });

  describe('getPagesToDisplay', () => {
    describe('with 5 or fewer total pages', () => {
      it('shows all pages when total is 5', () => {
        expect(getPagesToDisplay(1, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(3, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(5, 5)).toEqual([1, 2, 3, 4, 5]);
      });

      it('shows all pages when total is 4', () => {
        expect(getPagesToDisplay(1, 4)).toEqual([1, 2, 3, 4]);
        expect(getPagesToDisplay(2, 4)).toEqual([1, 2, 3, 4]);
        expect(getPagesToDisplay(4, 4)).toEqual([1, 2, 3, 4]);
      });

      it('shows all pages when total is 3', () => {
        expect(getPagesToDisplay(1, 3)).toEqual([1, 2, 3]);
        expect(getPagesToDisplay(2, 3)).toEqual([1, 2, 3]);
        expect(getPagesToDisplay(3, 3)).toEqual([1, 2, 3]);
      });

      it('shows all pages when total is 2', () => {
        expect(getPagesToDisplay(1, 2)).toEqual([1, 2]);
        expect(getPagesToDisplay(2, 2)).toEqual([1, 2]);
      });

      it('shows single page when total is 1', () => {
        expect(getPagesToDisplay(1, 1)).toEqual([1]);
      });
    });

    describe('with more than 5 total pages - early pages', () => {
      it('shows first 5 when on page 1', () => {
        expect(getPagesToDisplay(1, 10)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(1, 20)).toEqual([1, 2, 3, 4, 5]);
      });

      it('shows first 5 when on page 2', () => {
        expect(getPagesToDisplay(2, 10)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(2, 15)).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('with more than 5 total pages - late pages', () => {
      it('shows last 5 when on last page', () => {
        expect(getPagesToDisplay(10, 10)).toEqual([6, 7, 8, 9, 10]);
        expect(getPagesToDisplay(20, 20)).toEqual([16, 17, 18, 19, 20]);
      });

      it('shows last 5 when on second-to-last page', () => {
        expect(getPagesToDisplay(9, 10)).toEqual([6, 7, 8, 9, 10]);
        expect(getPagesToDisplay(19, 20)).toEqual([16, 17, 18, 19, 20]);
      });

      it('shows last 5 when near end', () => {
        expect(getPagesToDisplay(8, 10)).toEqual([6, 7, 8, 9, 10]);
      });
    });

    describe('with more than 5 total pages - middle pages', () => {
      it('centers around current page', () => {
        expect(getPagesToDisplay(5, 10)).toEqual([3, 4, 5, 6, 7]);
        expect(getPagesToDisplay(6, 10)).toEqual([4, 5, 6, 7, 8]);
        expect(getPagesToDisplay(10, 20)).toEqual([8, 9, 10, 11, 12]);
      });

      it('shows 2 pages before and 2 after current', () => {
        const result = getPagesToDisplay(5, 10);
        expect(result).toContain(3); // 2 before
        expect(result).toContain(4); // 1 before
        expect(result).toContain(5); // current
        expect(result).toContain(6); // 1 after
        expect(result).toContain(7); // 2 after
      });
    });

    describe('edge cases', () => {
      it('handles page 3 boundary (transition from start)', () => {
        // Page 3 is the boundary where behavior changes
        expect(getPagesToDisplay(3, 10)).toEqual([1, 2, 3, 4, 5]);
      });

      it('handles 6 total pages', () => {
        // With 6 pages, the logic:
        // - Page 1-2: pageNumber < 3, shows first 5
        // - Page 3+: pageNumber >= numberOfPages - 3 (6-3=3), shows last 5
        expect(getPagesToDisplay(1, 6)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(2, 6)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(3, 6)).toEqual([2, 3, 4, 5, 6]); // 3 >= 3, so last 5
        expect(getPagesToDisplay(4, 6)).toEqual([2, 3, 4, 5, 6]);
        expect(getPagesToDisplay(6, 6)).toEqual([2, 3, 4, 5, 6]);
      });
    });
  });
});
