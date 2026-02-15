import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '../Alert';

describe('Alert', () => {
  describe('rendering', () => {
    it('renders with alert role', () => {
      render(<Alert>Message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(<Alert>Test message</Alert>);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('applies alert class', () => {
      render(<Alert>Message</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('alert');
    });

    it('applies variant class', () => {
      render(<Alert variant="danger">Error</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('alert-danger');
    });

    it('defaults to primary variant', () => {
      render(<Alert>Message</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('alert-primary');
    });

    it('applies custom className', () => {
      render(<Alert className="custom">Message</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('alert', 'custom');
    });

    it('has displayName', () => {
      expect(Alert.displayName).toBe('Alert');
    });
  });

  describe('show prop', () => {
    it('renders when show is true', () => {
      render(<Alert show>Visible</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
      render(<Alert show={false}>Hidden</Alert>);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('defaults to show=true', () => {
      render(<Alert>Visible</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('dismissible', () => {
    it('renders close button when dismissible', () => {
      render(<Alert dismissible>Message</Alert>);
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('does not render close button when not dismissible', () => {
      render(<Alert>Message</Alert>);
      expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
    });

    it('applies alert-dismissible class', () => {
      render(<Alert dismissible>Message</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('alert-dismissible');
    });

    it('calls onClose when close button clicked', () => {
      const onClose = vi.fn();
      render(<Alert dismissible onClose={onClose}>Message</Alert>);
      fireEvent.click(screen.getByLabelText('Close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Alert.Heading', () => {
    it('renders with alert-heading class', () => {
      render(
        <Alert>
          <Alert.Heading>Title</Alert.Heading>
        </Alert>
      );
      expect(screen.getByText('Title')).toHaveClass('alert-heading');
    });

    it('has displayName', () => {
      expect(Alert.Heading.displayName).toBe('Alert.Heading');
    });
  });

  describe('variants', () => {
    it.each(['danger', 'warning', 'success', 'info', 'primary'] as const)('supports %s variant', (variant) => {
      render(<Alert variant={variant}>Message</Alert>);
      expect(screen.getByRole('alert')).toHaveClass(`alert-${variant}`);
    });
  });
});
