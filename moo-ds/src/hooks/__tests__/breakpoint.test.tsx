import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsAtLeast } from '../breakpoint';
import { breakpoints } from '../../models/breakpoints';

const listeners = new Set<() => void>();
let matches = false;

const mockMatchMedia = (initial: boolean) => {
  matches = initial;
  listeners.clear();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() { return matches; },
    media: query,
    addEventListener: (_: string, cb: () => void) => { listeners.add(cb); },
    removeEventListener: (_: string, cb: () => void) => { listeners.delete(cb); },
  })) as unknown as typeof window.matchMedia;
};

const setMatches = (value: boolean) => {
  matches = value;
  act(() => { listeners.forEach(cb => cb()); });
};

describe('breakpoints', () => {
  it('matches the values the stylesheet uses', () => {
    expect(breakpoints.sm).toBe(576);
    expect(breakpoints.md).toBe(768);
    expect(breakpoints.lg).toBe(992);
    expect(breakpoints.xl).toBe(1200);
  });
});

describe('useIsAtLeast', () => {
  beforeEach(() => { mockMatchMedia(false); });

  it('queries min-width for the named breakpoint', () => {
    renderHook(() => useIsAtLeast('lg'));
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 992px)');
  });

  it('returns false below the breakpoint', () => {
    const { result } = renderHook(() => useIsAtLeast('md'));
    expect(result.current).toBe(false);
  });

  it('returns true at or above the breakpoint', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useIsAtLeast('md'));
    expect(result.current).toBe(true);
  });

  it('updates when the viewport crosses the breakpoint', () => {
    const { result } = renderHook(() => useIsAtLeast('md'));
    expect(result.current).toBe(false);
    setMatches(true);
    expect(result.current).toBe(true);
  });

  it('removes its listener on unmount', () => {
    const { unmount } = renderHook(() => useIsAtLeast('md'));
    expect(listeners.size).toBe(1);
    unmount();
    expect(listeners.size).toBe(0);
  });
});
