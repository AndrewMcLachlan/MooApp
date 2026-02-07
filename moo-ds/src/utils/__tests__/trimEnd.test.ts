import { describe, it, expect } from 'vitest';
import { trimEnd } from '../trimEnd';

describe('trimEnd', () => {
  describe('basic trimming', () => {
    it('trims single character from end', () => {
      expect(trimEnd('/', 'hello/')).toBe('hello');
    });

    it('trims multiple occurrences from end', () => {
      expect(trimEnd('/', 'hello///')).toBe('hello');
    });

    it('trims multi-character string from end', () => {
      expect(trimEnd('ab', 'helloabab')).toBe('hello');
    });

    it('does not trim from start', () => {
      expect(trimEnd('/', '/hello/')).toBe('/hello');
    });

    it('does not trim from middle', () => {
      expect(trimEnd('/', 'hel/lo/')).toBe('hel/lo');
    });
  });

  describe('no trimming needed', () => {
    it('returns same string if character not at end', () => {
      expect(trimEnd('/', 'hello')).toBe('hello');
    });

    it('returns same string if different character at end', () => {
      expect(trimEnd('/', 'hello!')).toBe('hello!');
    });
  });

  describe('edge cases', () => {
    it('handles empty string', () => {
      expect(trimEnd('/', '')).toBe('');
    });

    it('handles empty charsToRemove', () => {
      expect(trimEnd('', 'hello')).toBe('hello');
    });

    it('handles null/undefined string', () => {
      expect(trimEnd('/', null as any)).toBe(null);
      expect(trimEnd('/', undefined as any)).toBe(undefined);
    });

    it('handles null/undefined charsToRemove', () => {
      expect(trimEnd(null as any, 'hello')).toBe('hello');
      expect(trimEnd(undefined as any, 'hello')).toBe('hello');
    });

    it('trims entire string if it equals charsToRemove', () => {
      expect(trimEnd('hello', 'hello')).toBe('');
    });

    it('trims repeated pattern', () => {
      expect(trimEnd('ab', 'abababab')).toBe('');
    });
  });

  describe('special characters', () => {
    it('trims newline character', () => {
      expect(trimEnd('\n', 'hello\n\n')).toBe('hello');
    });

    it('trims tab character', () => {
      expect(trimEnd('\t', 'hello\t')).toBe('hello');
    });

    it('trims space', () => {
      expect(trimEnd(' ', 'hello   ')).toBe('hello');
    });

    it('trims backslash', () => {
      expect(trimEnd('\\', 'path\\to\\file\\')).toBe('path\\to\\file');
    });
  });

  describe('URL path trimming (common use case)', () => {
    it('trims trailing slash from URL path', () => {
      expect(trimEnd('/', '/api/users/')).toBe('/api/users');
    });

    it('trims multiple trailing slashes from URL path', () => {
      expect(trimEnd('/', '/api/users///')).toBe('/api/users');
    });

    it('preserves leading slash', () => {
      expect(trimEnd('/', '/')).toBe('');
    });
  });
});
