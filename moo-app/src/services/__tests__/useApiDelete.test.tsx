import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiDelete } from '../useApiDelete';
import { HttpClientContext } from '../../providers/HttpClientProvider';

// Mock http client
const mockDelete = vi.fn();
const mockHttpClient = {
  delete: mockDelete,
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

describe('useApiDelete', () => {
  beforeEach(() => {
    mockDelete.mockClear();
    mockSendMessage.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('returns mutation result', () => {
      const { result } = renderHook(
        () => useApiDelete<{ id: number }>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
    });

    it('calls DELETE with correct path', async () => {
      mockDelete.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate({ id: 42 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockDelete).toHaveBeenCalledWith('/api/items/42');
    });

    it('handles complex path variables', async () => {
      mockDelete.mockResolvedValue({ data: null });

      const { result } = renderHook(
        () => useApiDelete<{ categoryId: number; itemId: number }>(
          (vars) => `/api/categories/${vars.categoryId}/items/${vars.itemId}`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate({ categoryId: 5, itemId: 10 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockDelete).toHaveBeenCalledWith('/api/categories/5/items/10');
    });
  });

  describe('error handling', () => {
    it('handles errors with error handler', async () => {
      mockDelete.mockRejectedValue({
        response: { data: { detail: 'Cannot delete' } },
      });

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate({ id: 1 });
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
      mockDelete.mockRejectedValue({
        response: { data: { detail: 'Resource in use' } },
      });

      const onError = vi.fn();

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>(
          (vars) => `/api/items/${vars.id}`,
          { onError }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('handles network errors', async () => {
      mockDelete.mockRejectedValue({
        request: {},
        response: undefined,
      });

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>((vars) => `/api/items/${vars.id}`),
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

  describe('with options', () => {
    it('accepts onSuccess callback', async () => {
      mockDelete.mockResolvedValue({ data: null });
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>(
          (vars) => `/api/items/${vars.id}`,
          { onSuccess }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('accepts onMutate for optimistic updates', async () => {
      mockDelete.mockResolvedValue({ data: null });
      const onMutate = vi.fn().mockReturnValue({ previousItems: [{ id: 1 }] });

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>(
          (vars) => `/api/items/${vars.id}`,
          { onMutate }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onMutate).toHaveBeenCalled();
      expect(onMutate.mock.calls[0][0]).toEqual({ id: 1 });
    });

    it('accepts onSettled callback', async () => {
      mockDelete.mockResolvedValue({ data: null });
      const onSettled = vi.fn();

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>(
          (vars) => `/api/items/${vars.id}`,
          { onSettled }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSettled).toHaveBeenCalled();
    });
  });

  describe('mutation states', () => {
    it('starts in idle state', () => {
      const { result } = renderHook(
        () => useApiDelete<{ id: number }>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isIdle).toBe(true);
    });

    it('transitions to pending during deletion', async () => {
      let resolvePromise: (value: any) => void;
      mockDelete.mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve; })
      );

      const { result } = renderHook(
        () => useApiDelete<{ id: number }>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      act(() => {
        result.current.mutate({ id: 1 });
      });

      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      expect(result.current.isIdle).toBe(false);

      act(() => {
        resolvePromise!({ data: null });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('reset functionality', () => {
    it('has reset method', () => {
      const { result } = renderHook(
        () => useApiDelete<{ id: number }>((vars) => `/api/items/${vars.id}`),
        { wrapper: createWrapper() }
      );

      expect(result.current.reset).toBeDefined();
      expect(typeof result.current.reset).toBe('function');
    });
  });
});
