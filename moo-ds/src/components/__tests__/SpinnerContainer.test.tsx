import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render } from '@testing-library/react';
import { SpinnerContainer } from '../SpinnerContainer';

// The spinner inherits Spinner's 300ms delay, so nothing paints for waits that
// resolve first. Advance timers to assert on the spinner itself.
const renderSettled = () => {
  const result = render(<SpinnerContainer />);
  act(() => { vi.advanceTimersByTime(300); });
  return result;
};

describe('SpinnerContainer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('renders spinner', () => {
      vi.useFakeTimers();
      const { container } = renderSettled();

      expect(container.querySelector('.spinner-comet')).toBeInTheDocument();
    });

    it('renders with spinner-container class', () => {
      const { container } = render(<SpinnerContainer />);

      expect(container.querySelector('.spinner-container')).toBeInTheDocument();
    });

    it('renders comet animation spinner', () => {
      vi.useFakeTimers();
      const { container } = renderSettled();

      expect(container.querySelector('.spinner-comet')).toBeInTheDocument();
    });

    it('holds the spinner back until the delay elapses', () => {
      vi.useFakeTimers();
      const { container } = render(<SpinnerContainer />);

      expect(container.querySelector('.spinner-container')).toBeInTheDocument();
      expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('wraps spinner in container div', () => {
      vi.useFakeTimers();
      const { container } = renderSettled();

      const containerDiv = container.querySelector('.spinner-container');
      expect(containerDiv?.querySelector('.spinner-comet')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(SpinnerContainer.displayName).toBe('SpinnerContainer');
    });
  });
});
