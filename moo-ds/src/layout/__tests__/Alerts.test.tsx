import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alerts } from '../Alerts';
import { MessageProvider, MessageContext } from '../../providers/MessageProvider';
import type { Messages, Message } from '../../models';

describe('Alerts', () => {
  describe('with MessageProvider', () => {
    it('renders container div', () => {
      const { container } = render(
        <MessageProvider>
          <Alerts />
        </MessageProvider>
      );

      expect(container.querySelector('.alerts')).toBeInTheDocument();
    });

    it('renders no alerts when no messages', () => {
      render(
        <MessageProvider>
          <Alerts />
        </MessageProvider>
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('with mock context', () => {
    const createMockContext = (messages: Message[], clearMessage = vi.fn()): Messages => ({
      messages,
      sendMessage: vi.fn(),
      clearMessage,
    });

    it('renders single alert', () => {
      const mockContext = createMockContext([
        { key: 'msg1', message: 'Test message', variant: 'info' },
      ]);

      render(
        <MessageContext.Provider value={mockContext}>
          <Alerts />
        </MessageContext.Provider>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders multiple alerts', () => {
      const mockContext = createMockContext([
        { key: 'msg1', message: 'First message', variant: 'info' },
        { key: 'msg2', message: 'Second message', variant: 'warning' },
        { key: 'msg3', message: 'Third message', variant: 'danger' },
      ]);

      render(
        <MessageContext.Provider value={mockContext}>
          <Alerts />
        </MessageContext.Provider>
      );

      expect(screen.getAllByRole('alert')).toHaveLength(3);
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.getByText('Third message')).toBeInTheDocument();
    });

    it('applies correct variant class', () => {
      const mockContext = createMockContext([
        { key: 'msg1', message: 'Success message', variant: 'success' },
      ]);

      render(
        <MessageContext.Provider value={mockContext}>
          <Alerts />
        </MessageContext.Provider>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('alert-success');
    });

    it('renders all variant types correctly', () => {
      const mockContext = createMockContext([
        { key: 'msg1', message: 'Success', variant: 'success' },
        { key: 'msg2', message: 'Info', variant: 'info' },
        { key: 'msg3', message: 'Warning', variant: 'warning' },
        { key: 'msg4', message: 'Danger', variant: 'danger' },
      ]);

      render(
        <MessageContext.Provider value={mockContext}>
          <Alerts />
        </MessageContext.Provider>
      );

      const alerts = screen.getAllByRole('alert');
      expect(alerts[0]).toHaveClass('alert-success');
      expect(alerts[1]).toHaveClass('alert-info');
      expect(alerts[2]).toHaveClass('alert-warning');
      expect(alerts[3]).toHaveClass('alert-danger');
    });

    it('renders dismissible alerts', () => {
      const mockContext = createMockContext([
        { key: 'msg1', message: 'Dismissible', variant: 'info' },
      ]);

      render(
        <MessageContext.Provider value={mockContext}>
          <Alerts />
        </MessageContext.Provider>
      );

      // React Bootstrap adds a close button for dismissible alerts
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('calls clearMessage when alert is dismissed', () => {
      const clearMessage = vi.fn();
      const mockContext = createMockContext(
        [{ key: 'msg1', message: 'Test', variant: 'info' }],
        clearMessage
      );

      render(
        <MessageContext.Provider value={mockContext}>
          <Alerts />
        </MessageContext.Provider>
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(clearMessage).toHaveBeenCalledWith('msg1');
    });

    it('uses message key as React key', () => {
      const mockContext = createMockContext([
        { key: 'unique-key-1', message: 'Message 1', variant: 'info' },
        { key: 'unique-key-2', message: 'Message 2', variant: 'warning' },
      ]);

      const { container } = render(
        <MessageContext.Provider value={mockContext}>
          <Alerts />
        </MessageContext.Provider>
      );

      // Verify alerts render correctly (keys are used internally by React)
      expect(container.querySelectorAll('.alert')).toHaveLength(2);
    });
  });

  describe('without MessageProvider', () => {
    it('throws error when used outside MessageProvider', () => {
      expect(() => render(<Alerts />)).toThrow("useMessages must be used within a MessageProvider");
    });
  });
});
