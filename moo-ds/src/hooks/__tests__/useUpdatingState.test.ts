import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUpdatingState } from '../updatingState';

describe('useUpdatingState', () => {
  describe('initialization', () => {
    it('returns initial value', () => {
      const { result } = renderHook(() => useUpdatingState('initial'));

      expect(result.current[0]).toBe('initial');
    });

    it('accepts function as initial value', () => {
      const { result } = renderHook(() => useUpdatingState(() => 'computed'));

      expect(result.current[0]).toBe('computed');
    });

    it('handles number values', () => {
      const { result } = renderHook(() => useUpdatingState(42));

      expect(result.current[0]).toBe(42);
    });

    it('handles object values', () => {
      const { result } = renderHook(() => useUpdatingState({ name: 'test' }));

      expect(result.current[0]).toEqual({ name: 'test' });
    });

    it('handles array values', () => {
      const { result } = renderHook(() => useUpdatingState([1, 2, 3]));

      expect(result.current[0]).toEqual([1, 2, 3]);
    });
  });

  describe('setState', () => {
    it('updates state with new value', () => {
      const { result } = renderHook(() => useUpdatingState('initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    it('accepts function updater', () => {
      const { result } = renderHook(() => useUpdatingState(5));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(6);
    });

    it('can update multiple times', () => {
      const { result } = renderHook(() => useUpdatingState(0));

      act(() => {
        result.current[1](1);
      });
      act(() => {
        result.current[1](2);
      });
      act(() => {
        result.current[1](3);
      });

      expect(result.current[0]).toBe(3);
    });
  });

  describe('prop sync', () => {
    it('updates state when prop value changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useUpdatingState(value),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current[0]).toBe('initial');

      rerender({ value: 'updated' });

      expect(result.current[0]).toBe('updated');
    });

    it('syncs object prop changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useUpdatingState(value),
        { initialProps: { value: { count: 0 } } }
      );

      expect(result.current[0]).toEqual({ count: 0 });

      rerender({ value: { count: 10 } });

      expect(result.current[0]).toEqual({ count: 10 });
    });

    it('syncs array prop changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useUpdatingState(value),
        { initialProps: { value: [1, 2] } }
      );

      expect(result.current[0]).toEqual([1, 2]);

      rerender({ value: [3, 4, 5] });

      expect(result.current[0]).toEqual([3, 4, 5]);
    });

    it('local state changes are overwritten by prop changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useUpdatingState(value),
        { initialProps: { value: 'prop' } }
      );

      act(() => {
        result.current[1]('local');
      });

      expect(result.current[0]).toBe('local');

      rerender({ value: 'newProp' });

      expect(result.current[0]).toBe('newProp');
    });

    it('preserves local state when prop reference is same', () => {
      // The useEffect has [value] as dependency, so it only runs when
      // the reference changes. Same reference = effect doesn't run.
      const value = { count: 0 };
      const { result, rerender } = renderHook(
        ({ value }) => useUpdatingState(value),
        { initialProps: { value } }
      );

      act(() => {
        result.current[1]({ count: 5 });
      });

      expect(result.current[0]).toEqual({ count: 5 });

      // Rerender with same reference - effect doesn't run
      rerender({ value });

      // Local state is preserved since reference didn't change
      expect(result.current[0]).toEqual({ count: 5 });
    });
  });
});
