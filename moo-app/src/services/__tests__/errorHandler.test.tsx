import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useErrorHandler } from '../errorHandler';

// Mock useMessages from moo-ds
const mockSendMessage = vi.fn();
vi.mock('@andrewmclachlan/moo-ds', () => ({
  useMessages: () => ({
    sendMessage: mockSendMessage,
  }),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    mockSendMessage.mockClear();
  });

  it('returns a function', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(typeof result.current).toBe('function');
  });

  it('sends error message with danger variant', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = new Error('Test error message');
    result.current(error);

    expect(mockSendMessage).toHaveBeenCalledWith({
      message: 'Test error message',
      variant: 'danger',
    });
  });

  it('sends default message when error.message is undefined', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = {} as Error;
    result.current(error);

    expect(mockSendMessage).toHaveBeenCalledWith({
      message: 'An error has occurred',
      variant: 'danger',
    });
  });

  it('handles empty error message', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = new Error('');
    result.current(error);

    // Empty string is passed through (uses ?? not ||)
    expect(mockSendMessage).toHaveBeenCalledWith({
      message: '',
      variant: 'danger',
    });
  });

  it('preserves error message content', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = new Error('Specific API failure: 404 Not Found');
    result.current(error);

    expect(mockSendMessage).toHaveBeenCalledWith({
      message: 'Specific API failure: 404 Not Found',
      variant: 'danger',
    });
  });
});
