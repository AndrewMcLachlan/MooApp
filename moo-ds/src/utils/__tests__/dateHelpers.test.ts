import { describe, it, expect } from 'vitest';
import { dateOnly, nextSunday, toUrl } from '../dateHelpers';

describe('dateHelpers', () => {
  describe('dateOnly', () => {
    it('formats date with default separator', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(dateOnly(date)).toBe('2024-1-15');
    });

    it('formats date with custom separator', () => {
      const date = new Date(2024, 0, 15);
      expect(dateOnly(date, '/')).toBe('2024/1/15');
    });

    it('handles single-digit month', () => {
      const march = new Date(2024, 2, 5); // March 5, 2024
      expect(dateOnly(march)).toBe('2024-3-5');
    });

    it('handles double-digit month', () => {
      const december = new Date(2024, 11, 25); // December 25, 2024
      expect(dateOnly(december)).toBe('2024-12-25');
    });

    it('handles first day of year', () => {
      const newYear = new Date(2024, 0, 1);
      expect(dateOnly(newYear)).toBe('2024-1-1');
    });

    it('handles last day of year', () => {
      const newYearsEve = new Date(2024, 11, 31);
      expect(dateOnly(newYearsEve)).toBe('2024-12-31');
    });
  });

  describe('nextSunday', () => {
    it('returns same day if already Sunday', () => {
      const sunday = new Date(2024, 0, 7); // January 7, 2024 is Sunday
      const result = nextSunday(sunday);
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getDate()).toBe(7);
    });

    it('returns next Sunday for Monday', () => {
      const monday = new Date(2024, 0, 8); // January 8, 2024 is Monday
      const result = nextSunday(monday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(14); // Next Sunday
    });

    it('returns next Sunday for Tuesday', () => {
      const tuesday = new Date(2024, 0, 9);
      const result = nextSunday(tuesday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(14);
    });

    it('returns next Sunday for Wednesday', () => {
      const wednesday = new Date(2024, 0, 10);
      const result = nextSunday(wednesday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(14);
    });

    it('returns next Sunday for Thursday', () => {
      const thursday = new Date(2024, 0, 11);
      const result = nextSunday(thursday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(14);
    });

    it('returns next Sunday for Friday', () => {
      const friday = new Date(2024, 0, 12);
      const result = nextSunday(friday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(14);
    });

    it('returns next Sunday for Saturday', () => {
      const saturday = new Date(2024, 0, 6); // January 6, 2024 is Saturday
      const result = nextSunday(saturday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(7);
    });

    it('accepts string date input', () => {
      const result = nextSunday('2024-01-08'); // Monday
      expect(result.getDay()).toBe(0);
    });

    it('resets time to midnight', () => {
      const date = new Date(2024, 0, 8, 14, 30, 45);
      const result = nextSunday(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });

    it('handles month boundary', () => {
      // January 29, 2024 is Monday, next Sunday is February 4
      const monday = new Date(2024, 0, 29);
      const result = nextSunday(monday);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(4);
    });

    it('handles year boundary', () => {
      // December 30, 2024 is Monday, next Sunday is January 5, 2025
      const monday = new Date(2024, 11, 30);
      const result = nextSunday(monday);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(5);
    });
  });

  describe('toUrl', () => {
    it('formats date for URL with / separator', () => {
      const monday = new Date(2024, 0, 8);
      const result = toUrl(monday);
      expect(result).toBe('2024/1/14'); // Next Sunday
    });

    it('works with Sunday input', () => {
      const sunday = new Date(2024, 0, 7);
      const result = toUrl(sunday);
      expect(result).toBe('2024/1/7');
    });

    it('handles month boundary in URL', () => {
      const monday = new Date(2024, 0, 29);
      const result = toUrl(monday);
      expect(result).toBe('2024/2/4'); // February 4
    });
  });
});
