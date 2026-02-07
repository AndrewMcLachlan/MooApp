import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiPatch } from '../useApiPatch';
import { HttpClientContext } from '../../providers/HttpClientProvider';

// Mock http client
const mockPatch = vi.fn();
const mockHttpClient = {
  patch: mockPatch,
};

// Mock error handler
const mockSendMessage = vi.fn();
vi.mock('@andrewmclachlan/moo-ds', () => ({
  useMessages: () => ({
    sendMessage: mockSendMessage,
  }),
}));

// Create wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
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

describe('useApiPatch', () => {
  beforeEach(() => {
    mockPatch.mockClear();
    mockSendMessage.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('returns mutation result', () => {
      const { result } = renderHook(
        () => useApiPatch<{ id: number }, { id: number }, { name: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
    });

    it('calls PATCH with correct path and data', async () => {
      mockPatch.mockResolvedValue({ data: { id: 1, name: 'Patched' } });

      const { result } = renderHook(
        () => useApiPatch<{ id: number; name: string }, { id: number }, { name: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 5 }, { name: 'Patched Name' }]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPatch).toHaveBeenCalledWith('/api/items/5', { name: 'Patched Name' });
    });

    it('returns response data', async () => {
      const responseData = { id: 1, status: 'active', updatedAt: '2024-01-01' };
      mockPatch.mockResolvedValue({ data: responseData });

      const { result } = renderHook(
        () => useApiPatch<typeof responseData, { id: number }, { status: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, { status: 'active' }]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(responseData);
    });
  });

  describe('partial updates', () => {
    it('sends only changed fields', async () => {
      mockPatch.mockResolvedValue({ data: { id: 1, name: 'Updated', status: 'active' } });

      const { result } = renderHook(
        () => useApiPatch<any, { id: number }, Partial<{ name: string; status: string }>>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, { name: 'Updated' }]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Only name was sent, not status
      expect(mockPatch).toHaveBeenCalledWith('/api/items/1', { name: 'Updated' });
    });
  });

  describe('error handling', () => {
    it('handles errors with error handler', async () => {
      mockPatch.mockRejectedValue({
        response: { data: { detail: 'Patch failed' } },
      });

      const { result } = renderHook(
        () => useApiPatch<null, { id: number }, { field: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, { field: 'invalid' }]);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockSendMessage).toHaveBeenCalledWith({
        message: expect.any(String),
        variant: 'danger',
      });
    });

    it('calls custom onError callback', async () => {
      mockPatch.mockRejectedValue({
        response: { data: { detail: 'Validation error' } },
      });

      const onError = vi.fn();

      const { result } = renderHook(
        () => useApiPatch<null, { id: number }, {}>(
          (vars) => `/api/items/${vars.id}`,
          { onError }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, {}]);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('with options', () => {
    it('accepts onSuccess callback', async () => {
      mockPatch.mockResolvedValue({ data: { patched: true } });
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useApiPatch<{ patched: boolean }, { id: number }, {}>(
          (vars) => `/api/items/${vars.id}`,
          { onSuccess }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, {}]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
      expect(onSuccess.mock.calls[0][0]).toEqual({ patched: true });
    });

    it('accepts onMutate callback', async () => {
      mockPatch.mockResolvedValue({ data: {} });
      const onMutate = vi.fn().mockReturnValue({ previousData: 'old' });

      const { result } = renderHook(
        () => useApiPatch<{}, { id: number }, {}>(
          (vars) => `/api/items/${vars.id}`,
          { onMutate }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, {}]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onMutate).toHaveBeenCalled();
    });
  });

  describe('mutation states', () => {
    it('starts in idle state', () => {
      const { result } = renderHook(
        () => useApiPatch<{}, { id: number }, {}>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('transitions through pending to success', async () => {
      let resolvePromise: (value: any) => void;
      mockPatch.mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve; })
      );

      const { result } = renderHook(
        () => useApiPatch<{}, { id: number }, {}>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.mutate([{ id: 1 }, {}]);
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      act(() => {
        resolvePromise!({ data: {} });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });
  });
});
