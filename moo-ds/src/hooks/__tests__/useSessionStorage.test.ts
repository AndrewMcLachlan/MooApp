import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionStorage } from '../sessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  describe('initialization', () => {
    it('returns initial value when sessionStorage is empty', () => {
      const { result } = renderHook(() =>
        useSessionStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('initialValue');
    });

    it('returns stored value from sessionStorage', () => {
      window.sessionStorage.setItem('testKey', JSON.stringify('storedValue'));

      const { result } = renderHook(() =>
        useSessionStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('storedValue');
    });

    it('accepts function as initial value (returns function directly)', () => {
      // Note: The implementation does not call the function - it returns it as-is
      const initFn = () => 'computed';
      const { result } = renderHook(() =>
        useSessionStorage('testKey', initFn)
      );

      // The implementation returns the function itself when storage is empty
      expect(result.current[0]).toBe(initFn);
    });

    it('handles undefined initial value', () => {
      const { result } = renderHook(() =>
        useSessionStorage<string | undefined>('testKey', undefined)
      );

      expect(result.current[0]).toBeUndefined();
    });
  });

  describe('setValue', () => {
    it('updates sessionStorage and state', () => {
      const { result } = renderHook(() =>
        useSessionStorage('testKey', 'initial')
      );

      act(() => {
        result.current[1]('newValue');
      });

      expect(result.current[0]).toBe('newValue');
      expect(window.sessionStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
    });

    it('accepts function updater', () => {
      const { result } = renderHook(() =>
        useSessionStorage<number>('testKey', 5)
      );

      act(() => {
        result.current[1]((prev) => prev * 2);
      });

      expect(result.current[0]).toBe(10);
    });

    it('persists objects', () => {
      const { result } = renderHook(() =>
        useSessionStorage('testKey', { name: 'test' })
      );

      act(() => {
        result.current[1]({ name: 'updated' });
      });

      expect(JSON.parse(window.sessionStorage.getItem('testKey')!)).toEqual({ name: 'updated' });
    });

    it('persists arrays', () => {
      const { result } = renderHook(() =>
        useSessionStorage<number[]>('testKey', [])
      );

      act(() => {
        result.current[1]([1, 2, 3]);
      });

      expect(JSON.parse(window.sessionStorage.getItem('testKey')!)).toEqual([1, 2, 3]);
    });
  });

  describe('persistence across renders', () => {
    it('maintains value across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useSessionStorage('testKey', 'initial')
      );

      act(() => {
        result.current[1]('updated');
      });

      rerender();

      expect(result.current[0]).toBe('updated');
    });
  });

  describe('isolation from localStorage', () => {
    it('does not affect localStorage', () => {
      const { result } = renderHook(() =>
        useSessionStorage('testKey', 'sessionValue')
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(window.localStorage.getItem('testKey')).toBeNull();
      expect(window.sessionStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
    });
  });
});
