import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiPut, useApiPutEmpty } from '../useApiPut';
import { HttpClientContext } from '../../providers/HttpClientProvider';

// Mock http client
const mockPut = vi.fn();
const mockHttpClient = {
  put: mockPut,
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

describe('useApiPut', () => {
  beforeEach(() => {
    mockPut.mockClear();
    mockSendMessage.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('returns mutation result', () => {
      const { result } = renderHook(
        () => useApiPut<{ id: number }, { id: number }, { name: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
    });

    it('calls PUT with correct path and data', async () => {
      mockPut.mockResolvedValue({ data: { id: 1, name: 'Updated' } });

      const { result } = renderHook(
        () => useApiPut<{ id: number; name: string }, { id: number }, { name: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 5 }, { name: 'Updated Name' }]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPut).toHaveBeenCalledWith('/api/items/5', { name: 'Updated Name' });
    });

    it('returns response data', async () => {
      const responseData = { id: 1, name: 'Updated', updatedAt: '2024-01-01' };
      mockPut.mockResolvedValue({ data: responseData });

      const { result } = renderHook(
        () => useApiPut<typeof responseData, { id: number }, { name: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, { name: 'Test' }]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(responseData);
    });
  });

  describe('error handling', () => {
    it('handles errors with error handler', async () => {
      mockPut.mockRejectedValue({
        response: { data: { detail: 'Update failed' } },
      });

      const { result } = renderHook(
        () => useApiPut<null, { id: number }, { name: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ id: 1 }, { name: '' }]);
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
      mockPut.mockRejectedValue({
        response: { data: { detail: 'Conflict error' } },
      });

      const onError = vi.fn();

      const { result } = renderHook(
        () => useApiPut<null, { id: number }, {}>(
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
      mockPut.mockResolvedValue({ data: { updated: true } });
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useApiPut<{ updated: boolean }, { id: number }, {}>(
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
      expect(onSuccess.mock.calls[0][0]).toEqual({ updated: true });
    });
  });
});

describe('useApiPutEmpty', () => {
  beforeEach(() => {
    mockPut.mockClear();
    mockSendMessage.mockClear();
  });

  it('calls PUT without data body', async () => {
    mockPut.mockResolvedValue({ data: null });

    const { result } = renderHook(
      () => useApiPutEmpty<null, { id: number }>((vars) => `/api/items/${vars.id}/status`),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.mutate({ id: 42 });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockPut).toHaveBeenCalledWith('/api/items/42/status');
  });

  it('returns mutation result object', () => {
    const { result } = renderHook(
      () => useApiPutEmpty<null, { id: number }>((vars) => `/api/items/${vars.id}`),
      { wrapper: createWrapper() }
    );

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('isPending');
    expect(result.current).toHaveProperty('isSuccess');
  });

  it('handles errors', async () => {
    mockPut.mockRejectedValue({
      response: { data: { detail: 'Resource locked' } },
    });

    const { result } = renderHook(
      () => useApiPutEmpty<null, { id: number }>((vars) => `/api/items/${vars.id}/lock`),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.mutate({ id: 1 });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockSendMessage).toHaveBeenCalled();
  });
});
