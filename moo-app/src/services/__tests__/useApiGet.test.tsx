import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiGet, useApiPagedGet } from '../useApiGet';
import { HttpClientContext } from '../../providers/HttpClientProvider';

// Mock http client
const mockGet = vi.fn();
const mockHttpClient = {
  get: mockGet,
};

// Create wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <HttpClientContext.Provider value={mockHttpClient as any}>
        {children}
      </HttpClientContext.Provider>
    </QueryClientProvider>
  );
};

describe('useApiGet', () => {
  beforeEach(() => {
    mockGet.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('returns query result', () => {
      mockGet.mockResolvedValue({ data: { id: 1, name: 'Test' } });

      const { result } = renderHook(
        () => useApiGet<{ id: number; name: string }>(['test'], '/api/test'),
        { wrapper: createWrapper() }
      );

      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('error');
    });

    it('fetches data on mount', async () => {
      mockGet.mockResolvedValue({ data: { id: 1, name: 'Test Item' } });

      const { result } = renderHook(
        () => useApiGet<{ id: number; name: string }>(['test-item'], '/api/items/1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGet).toHaveBeenCalledWith('/api/items/1');
      expect(result.current.data).toEqual({ id: 1, name: 'Test Item' });
    });

    it('uses query key for caching', async () => {
      mockGet.mockResolvedValue({ data: { id: 1 } });

      const { result } = renderHook(
        () => useApiGet(['items', 1], '/api/items/1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('with options', () => {
    it('respects enabled option', () => {
      mockGet.mockResolvedValue({ data: {} });

      const { result } = renderHook(
        () => useApiGet(['disabled-query'], '/api/test', { enabled: false }),
        { wrapper: createWrapper() }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('accepts staleTime option', async () => {
      mockGet.mockResolvedValue({ data: { value: 'cached' } });

      const { result } = renderHook(
        () => useApiGet(['stale-query'], '/api/test', { staleTime: 60000 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({ value: 'cached' });
    });
  });

  describe('error handling', () => {
    it('handles fetch errors', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(
        () => useApiGet(['error-query'], '/api/failing'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('loading states', () => {
    it('starts in loading state', () => {
      mockGet.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(
        () => useApiGet(['loading-query'], '/api/test'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('transitions to success state', async () => {
      mockGet.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(
        () => useApiGet(['success-query'], '/api/test'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe('useApiPagedGet', () => {
  beforeEach(() => {
    mockGet.mockClear();
  });

  it('returns paged result with total from header', async () => {
    mockGet.mockResolvedValue({
      data: [{ id: 1 }, { id: 2 }],
      headers: { 'x-total-count': '100' },
    });

    const { result } = renderHook(
      () => useApiPagedGet<{ results: any[]; total: number }>(
        ['paged-items'],
        '/api/items?page=1'
      ),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.results).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.current.data?.total).toBe('100');
  });

  it('fetches paged data', async () => {
    mockGet.mockResolvedValue({
      data: [{ id: 1 }],
      headers: { 'x-total-count': '50' },
    });

    const { result } = renderHook(
      () => useApiPagedGet(['items-page-2'], '/api/items?page=2'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGet).toHaveBeenCalledWith('/api/items?page=2');
  });
});
