import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIdParams } from '../idParams';

// Mock useParams from react-router
const mockUseParams = vi.fn();

vi.mock('react-router', () => ({
  useParams: () => mockUseParams(),
}));

describe('useIdParams', () => {
  it('returns id when present in params', () => {
    mockUseParams.mockReturnValue({ id: '123' });

    const { result } = renderHook(() => useIdParams());

    expect(result.current).toBe('123');
  });

  it('returns string id', () => {
    mockUseParams.mockReturnValue({ id: 'abc-def-ghi' });

    const { result } = renderHook(() => useIdParams());

    expect(result.current).toBe('abc-def-ghi');
  });

  it('throws error when id is missing', () => {
    mockUseParams.mockReturnValue({});

    expect(() => {
      renderHook(() => useIdParams());
    }).toThrow('bad params');
  });

  it('throws error when id is undefined', () => {
    mockUseParams.mockReturnValue({ id: undefined });

    expect(() => {
      renderHook(() => useIdParams());
    }).toThrow('bad params');
  });

  it('throws error when id is empty string', () => {
    mockUseParams.mockReturnValue({ id: '' });

    expect(() => {
      renderHook(() => useIdParams());
    }).toThrow('bad params');
  });

  it('handles numeric string ids', () => {
    mockUseParams.mockReturnValue({ id: '42' });

    const { result } = renderHook(() => useIdParams());

    expect(result.current).toBe('42');
    expect(typeof result.current).toBe('string');
  });

  it('handles UUID format ids', () => {
    mockUseParams.mockReturnValue({ id: '550e8400-e29b-41d4-a716-446655440000' });

    const { result } = renderHook(() => useIdParams());

    expect(result.current).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('handles slug format ids', () => {
    mockUseParams.mockReturnValue({ id: 'my-cool-article' });

    const { result } = renderHook(() => useIdParams());

    expect(result.current).toBe('my-cool-article');
  });
});
