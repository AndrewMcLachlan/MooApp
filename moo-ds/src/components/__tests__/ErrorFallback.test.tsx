import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorFallback } from '../ErrorFallback';

describe('ErrorFallback', () => {
  const defaultProps = {
    error: new Error('Test error message'),
    resetErrorBoundary: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders error heading', () => {
      render(<ErrorFallback {...defaultProps} />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders error message', () => {
      render(<ErrorFallback {...defaultProps} />);

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('renders custom message when provided', () => {
      render(<ErrorFallback {...defaultProps} message="Please try again later." />);

      expect(screen.getByText('Please try again later.')).toBeInTheDocument();
    });

    it('does not render custom message when not provided', () => {
      render(<ErrorFallback {...defaultProps} />);

      expect(screen.queryByText('Please try again later.')).not.toBeInTheDocument();
    });

    it('renders as danger alert', () => {
      const { container } = render(<ErrorFallback {...defaultProps} />);

      const alert = container.querySelector('.alert-danger');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('dismissible behavior', () => {
    it('is not dismissible by default', () => {
      const { container } = render(<ErrorFallback {...defaultProps} />);

      const closeButton = container.querySelector('.btn-close');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('is dismissible when dismissible prop is true', () => {
      const { container } = render(<ErrorFallback {...defaultProps} dismissible />);

      const closeButton = container.querySelector('.btn-close');
      expect(closeButton).toBeInTheDocument();
    });

    it('calls resetErrorBoundary when dismissed', () => {
      const { container } = render(<ErrorFallback {...defaultProps} dismissible />);

      const closeButton = container.querySelector('.btn-close');
      fireEvent.click(closeButton!);

      expect(defaultProps.resetErrorBoundary).toHaveBeenCalledTimes(1);
    });

    it('calls onClose callback when dismissed', () => {
      const onClose = vi.fn();
      const { container } = render(
        <ErrorFallback {...defaultProps} dismissible onClose={onClose} />
      );

      const closeButton = container.querySelector('.btn-close');
      fireEvent.click(closeButton!);

      expect(onClose).toHaveBeenCalled();
    });

    it('calls both resetErrorBoundary and onClose when dismissed', () => {
      const onClose = vi.fn();
      const { container } = render(
        <ErrorFallback {...defaultProps} dismissible onClose={onClose} />
      );

      const closeButton = container.querySelector('.btn-close');
      fireEvent.click(closeButton!);

      expect(defaultProps.resetErrorBoundary).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('error types', () => {
    it('handles Error with message', () => {
      const error = new Error('Detailed error info');
      render(<ErrorFallback {...defaultProps} error={error} />);

      expect(screen.getByText('Detailed error info')).toBeInTheDocument();
    });

    it('handles Error with empty message', () => {
      const error = new Error('');
      const { container } = render(<ErrorFallback {...defaultProps} error={error} />);

      const pre = container.querySelector('pre');
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toBe('');
    });

    it('handles TypeError', () => {
      const error = new TypeError('Cannot read property of undefined');
      render(<ErrorFallback {...defaultProps} error={error} />);

      expect(screen.getByText('Cannot read property of undefined')).toBeInTheDocument();
    });

    it('handles ReferenceError', () => {
      const error = new ReferenceError('variable is not defined');
      render(<ErrorFallback {...defaultProps} error={error} />);

      expect(screen.getByText('variable is not defined')).toBeInTheDocument();
    });
  });
});
