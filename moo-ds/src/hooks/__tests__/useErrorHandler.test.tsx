import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useErrorHandler } from '../errorHandler';
import { MessageProvider, MessageContext } from '../../providers/MessageProvider';

describe('useErrorHandler', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MessageProvider>{children}</MessageProvider>
  );

  describe('error handling', () => {
    it('returns a function', () => {
      const { result } = renderHook(() => useErrorHandler(), { wrapper });

      expect(typeof result.current).toBe('function');
    });

    it('sends error message with danger variant', () => {
      const sendMessage = vi.fn();
      const mockContext = {
        messages: [],
        sendMessage,
        clearMessage: vi.fn(),
      };

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <MessageContext.Provider value={mockContext}>
          {children}
        </MessageContext.Provider>
      );

      const { result } = renderHook(() => useErrorHandler(), { wrapper: customWrapper });

      act(() => {
        result.current(new Error('Test error message'));
      });

      expect(sendMessage).toHaveBeenCalledWith({
        message: 'Test error message',
        variant: 'danger',
      });
    });

    it('uses default message when error.message is undefined', () => {
      const sendMessage = vi.fn();
      const mockContext = {
        messages: [],
        sendMessage,
        clearMessage: vi.fn(),
      };

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <MessageContext.Provider value={mockContext}>
          {children}
        </MessageContext.Provider>
      );

      const { result } = renderHook(() => useErrorHandler(), { wrapper: customWrapper });

      act(() => {
        const errorWithoutMessage = new Error();
        errorWithoutMessage.message = undefined as unknown as string;
        result.current(errorWithoutMessage);
      });

      expect(sendMessage).toHaveBeenCalledWith({
        message: 'An error has occurred',
        variant: 'danger',
      });
    });

    it('handles multiple errors', () => {
      const sendMessage = vi.fn();
      const mockContext = {
        messages: [],
        sendMessage,
        clearMessage: vi.fn(),
      };

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <MessageContext.Provider value={mockContext}>
          {children}
        </MessageContext.Provider>
      );

      const { result } = renderHook(() => useErrorHandler(), { wrapper: customWrapper });

      act(() => {
        result.current(new Error('First error'));
      });

      act(() => {
        result.current(new Error('Second error'));
      });

      expect(sendMessage).toHaveBeenCalledTimes(2);
      expect(sendMessage).toHaveBeenNthCalledWith(1, {
        message: 'First error',
        variant: 'danger',
      });
      expect(sendMessage).toHaveBeenNthCalledWith(2, {
        message: 'Second error',
        variant: 'danger',
      });
    });
  });

  describe('error types', () => {
    it('handles TypeError', () => {
      const sendMessage = vi.fn();
      const mockContext = {
        messages: [],
        sendMessage,
        clearMessage: vi.fn(),
      };

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <MessageContext.Provider value={mockContext}>
          {children}
        </MessageContext.Provider>
      );

      const { result } = renderHook(() => useErrorHandler(), { wrapper: customWrapper });

      act(() => {
        result.current(new TypeError('Type error occurred'));
      });

      expect(sendMessage).toHaveBeenCalledWith({
        message: 'Type error occurred',
        variant: 'danger',
      });
    });

    it('handles RangeError', () => {
      const sendMessage = vi.fn();
      const mockContext = {
        messages: [],
        sendMessage,
        clearMessage: vi.fn(),
      };

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <MessageContext.Provider value={mockContext}>
          {children}
        </MessageContext.Provider>
      );

      const { result } = renderHook(() => useErrorHandler(), { wrapper: customWrapper });

      act(() => {
        result.current(new RangeError('Range error occurred'));
      });

      expect(sendMessage).toHaveBeenCalledWith({
        message: 'Range error occurred',
        variant: 'danger',
      });
    });
  });
});
