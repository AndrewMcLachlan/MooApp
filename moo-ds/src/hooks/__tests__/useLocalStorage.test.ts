import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../localStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('initialization', () => {
    it('returns initial value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('initialValue');
    });

    it('returns stored value from localStorage', () => {
      window.localStorage.setItem('testKey', JSON.stringify('storedValue'));

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current[0]).toBe('storedValue');
    });

    it('accepts function as initial value (returns function directly)', () => {
      // Note: The implementation does not call the function - it returns it as-is
      const initFn = () => 'computed';
      const { result } = renderHook(() =>
        useLocalStorage('testKey', initFn)
      );

      // The implementation returns the function itself when storage is empty
      expect(result.current[0]).toBe(initFn);
    });

    it('handles undefined initial value', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | undefined>('testKey', undefined)
      );

      expect(result.current[0]).toBeUndefined();
    });
  });

  describe('setValue', () => {
    it('updates localStorage and state', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        result.current[1]('newValue');
      });

      expect(result.current[0]).toBe('newValue');
      expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
    });

    it('accepts function updater', () => {
      const { result } = renderHook(() =>
        useLocalStorage<number>('testKey', 5)
      );

      act(() => {
        result.current[1]((prev) => prev * 2);
      });

      expect(result.current[0]).toBe(10);
    });

    it('persists objects', () => {
      const { result } = renderHook(() =>
        useLocalStorage('testKey', { name: 'test' })
      );

      act(() => {
        result.current[1]({ name: 'updated' });
      });

      expect(JSON.parse(window.localStorage.getItem('testKey')!)).toEqual({ name: 'updated' });
    });

    it('persists arrays', () => {
      const { result } = renderHook(() =>
        useLocalStorage<number[]>('testKey', [])
      );

      act(() => {
        result.current[1]([1, 2, 3]);
      });

      expect(JSON.parse(window.localStorage.getItem('testKey')!)).toEqual([1, 2, 3]);
    });
  });

  describe('persistence across renders', () => {
    it('maintains value across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        result.current[1]('updated');
      });

      rerender();

      expect(result.current[0]).toBe('updated');
    });
  });

  describe('type safety', () => {
    it('handles number type', () => {
      const { result } = renderHook(() =>
        useLocalStorage<number>('testKey', 42)
      );

      expect(result.current[0]).toBe(42);

      act(() => {
        result.current[1](100);
      });

      expect(result.current[0]).toBe(100);
    });

    it('handles boolean type', () => {
      const { result } = renderHook(() =>
        useLocalStorage<boolean>('testKey', false)
      );

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });
  });
});
