import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner delay={0} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders visually hidden loading text', () => {
    render(<Spinner delay={0} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('defaults to comet animation', () => {
    render(<Spinner delay={0} />);
    expect(screen.getByRole('status')).toHaveClass('spinner-comet');
  });

  it('supports border animation', () => {
    render(<Spinner animation="border" delay={0} />);
    expect(screen.getByRole('status')).toHaveClass('spinner-border');
  });

  it('applies sm size for comet', () => {
    render(<Spinner size="sm" delay={0} />);
    expect(screen.getByRole('status')).toHaveClass('spinner-comet-sm');
  });

  it('applies sm size for border', () => {
    render(<Spinner animation="border" size="sm" delay={0} />);
    expect(screen.getByRole('status')).toHaveClass('spinner-border-sm');
  });

  it('renders as div by default', () => {
    render(<Spinner delay={0} />);
    expect(screen.getByRole('status').tagName).toBe('DIV');
  });

  it('renders with as prop', () => {
    render(<Spinner as="span" delay={0} />);
    expect(screen.getByRole('status').tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Spinner className="custom" delay={0} />);
    expect(screen.getByRole('status')).toHaveClass('spinner-comet', 'custom');
  });

  it('has displayName', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });

  describe('delay', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders nothing before the delay elapses', () => {
      vi.useFakeTimers();
      render(<Spinner />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('appears once the default 300ms delay elapses', () => {
      vi.useFakeTimers();
      render(<Spinner />);

      act(() => { vi.advanceTimersByTime(300); });

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('honours a custom delay', () => {
      vi.useFakeTimers();
      render(<Spinner delay={1000} />);

      act(() => { vi.advanceTimersByTime(300); });
      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(700); });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders immediately with delay 0', () => {
      vi.useFakeTimers();
      render(<Spinner delay={0} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
