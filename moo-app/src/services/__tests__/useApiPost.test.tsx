import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiPost, useApiPostEmpty, useApiPostFile } from '../useApiPost';
import { HttpClientContext } from '../../providers/HttpClientProvider';

// Mock http client
const mockPost = vi.fn();
const mockHttpClient = {
  post: mockPost,
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

describe('useApiPost', () => {
  beforeEach(() => {
    mockPost.mockClear();
    mockSendMessage.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('returns mutation result', () => {
      const { result } = renderHook(
        () => useApiPost<{ id: number }, { id: number }, { name: string }>(
          (vars) => `/api/items/${vars.id}`
        ),
        { wrapper: createWrapper() }
      );

      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('isSuccess');
    });

    it('calls POST with correct path and data', async () => {
      mockPost.mockResolvedValue({ data: { id: 1, name: 'Created' } });

      const { result } = renderHook(
        () => useApiPost<{ id: number; name: string }, { categoryId: number }, { name: string }>(
          (vars) => `/api/categories/${vars.categoryId}/items`
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{ categoryId: 5 }, { name: 'New Item' }]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPost).toHaveBeenCalledWith('/api/categories/5/items', { name: 'New Item' });
    });

    it('returns response data', async () => {
      const responseData = { id: 123, name: 'Created Item', createdAt: '2024-01-01' };
      mockPost.mockResolvedValue({ data: responseData });

      const { result } = renderHook(
        () => useApiPost<typeof responseData, {}, { name: string }>(
          () => '/api/items'
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{}, { name: 'Test' }]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(responseData);
    });
  });

  describe('error handling', () => {
    it('handles errors with error handler', async () => {
      mockPost.mockRejectedValue({
        response: { data: { detail: 'Validation failed' } },
      });

      const { result } = renderHook(
        () => useApiPost<null, {}, { name: string }>(() => '/api/items'),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{}, { name: '' }]);
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
      mockPost.mockRejectedValue({
        response: { data: { detail: 'Custom error' } },
      });

      const onError = vi.fn();

      const { result } = renderHook(
        () => useApiPost<null, {}, {}>(() => '/api/items', { onError }),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{}, {}]);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('with options', () => {
    it('accepts onSuccess callback', async () => {
      mockPost.mockResolvedValue({ data: { success: true } });
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useApiPost<{ success: boolean }, {}, {}>(
          () => '/api/items',
          { onSuccess }
        ),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.mutate([{}, {}]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
      expect(onSuccess.mock.calls[0][0]).toEqual({ success: true });
    });
  });
});

describe('useApiPostEmpty', () => {
  beforeEach(() => {
    mockPost.mockClear();
    mockSendMessage.mockClear();
  });

  it('calls POST without data body', async () => {
    mockPost.mockResolvedValue({ data: null });

    const { result } = renderHook(
      () => useApiPostEmpty<null, { id: number }>((vars) => `/api/items/${vars.id}/activate`),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.mutate({ id: 42 });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockPost).toHaveBeenCalledWith('/api/items/42/activate');
  });

  it('handles errors', async () => {
    mockPost.mockRejectedValue({
      response: { data: { detail: 'Not found' } },
    });

    const { result } = renderHook(
      () => useApiPostEmpty<null, { id: number }>((vars) => `/api/items/${vars.id}/action`),
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

describe('useApiPostFile', () => {
  beforeEach(() => {
    mockPost.mockClear();
    mockSendMessage.mockClear();
  });

  it('sends file as FormData', async () => {
    mockPost.mockResolvedValue({ data: null });

    const { result } = renderHook(
      () => useApiPostFile<{ file: File; id: number }>((vars) => `/api/items/${vars.id}/upload`),
      { wrapper: createWrapper() }
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    await act(async () => {
      result.current.mutate({ file, id: 1 });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockPost).toHaveBeenCalledWith(
      '/api/items/1/upload',
      expect.any(FormData)
    );
  });

  it('appends file with correct name', async () => {
    mockPost.mockResolvedValue({ data: null });
    let capturedFormData: FormData | null = null;
    mockPost.mockImplementation((path: string, data: FormData) => {
      capturedFormData = data;
      return Promise.resolve({ data: null });
    });

    const { result } = renderHook(
      () => useApiPostFile<{ file: File }>(() => '/api/upload'),
      { wrapper: createWrapper() }
    );

    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    await act(async () => {
      result.current.mutate({ file });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(capturedFormData?.get('file')).toBeInstanceOf(File);
  });
});
