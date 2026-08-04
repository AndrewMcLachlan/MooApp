import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

const root = (container: HTMLElement) => container.querySelector('.skeleton-chart');
const elements = (container: HTMLElement) => container.querySelectorAll('.skeleton-chart-element');

describe('Skeleton.Chart', () => {
  describe('rendering', () => {
    it('is decorative', () => {
      const { container } = render(<Skeleton.Chart />);

      expect(root(container)).toHaveAttribute('aria-hidden', 'true');
    });

    it('defaults to the bar variant', () => {
      const { container } = render(<Skeleton.Chart />);

      expect(root(container)).toHaveClass('skeleton-chart-bar');
    });

    it('applies custom className', () => {
      const { container } = render(<Skeleton.Chart className="custom" />);

      expect(root(container)).toHaveClass('skeleton-chart', 'custom');
    });

    it('has displayName', () => {
      expect(Skeleton.Chart.displayName).toBe('Skeleton.Chart');
    });
  });

  describe('element counts', () => {
    it('defaults to 6 bars', () => {
      const { container } = render(<Skeleton.Chart variant="bar" />);

      expect(elements(container)).toHaveLength(6);
    });

    it('defaults to 2 series for line', () => {
      const { container } = render(<Skeleton.Chart variant="line" />);

      expect(elements(container)).toHaveLength(2);
    });

    it.each(['bar', 'horizontal-bar', 'line'] as const)('count controls children for %s', (variant) => {
      const { container } = render(<Skeleton.Chart variant={variant} count={9} />);

      expect(elements(container)).toHaveLength(9);
    });

    it('renders no children for a count of 0', () => {
      const { container } = render(<Skeleton.Chart count={0} />);

      expect(elements(container)).toHaveLength(0);
    });

    it('renders no children for a negative count rather than throwing', () => {
      const { container } = render(<Skeleton.Chart count={-3} />);

      expect(elements(container)).toHaveLength(0);
    });

    // Infinity would reach Array.from as a length of 2^53-1 and raise a
    // RangeError; NaN would silently produce a count class that matches no rule.
    it('falls back to the default for a non-finite count', () => {
      const { container } = render(<Skeleton.Chart count={Number.NaN} />);

      expect(elements(container)).toHaveLength(6);
    });

    it('does not throw on an infinite count', () => {
      expect(() => render(<Skeleton.Chart count={Number.POSITIVE_INFINITY} />)).not.toThrow();
    });

    it('falls back to the line default for a non-finite count', () => {
      const { container } = render(<Skeleton.Chart variant="line" count={Number.NaN} />);

      expect(elements(container)).toHaveLength(2);
    });
  });

  describe('bars and lines shimmer', () => {
    it('marks each element as a skeleton', () => {
      const { container } = render(<Skeleton.Chart count={3} />);

      elements(container).forEach((element) => expect(element).toHaveClass('skeleton'));
    });

    it('does not put the shimmer on the container itself', () => {
      const { container } = render(<Skeleton.Chart />);

      expect(root(container)).not.toHaveClass('skeleton');
    });
  });

  describe('pie and doughnut', () => {
    it.each(['pie', 'doughnut'] as const)('renders %s as a single shimmering disc', (variant) => {
      const { container } = render(<Skeleton.Chart variant={variant} />);

      expect(root(container)).toHaveClass('skeleton', `skeleton-chart-${variant}`);
      expect(elements(container)).toHaveLength(0);
    });

    it('carries the slice count as a class', () => {
      const { container } = render(<Skeleton.Chart variant="pie" count={8} />);

      expect(root(container)).toHaveClass('skeleton-chart-count-8');
    });

    it('defaults to 6 slices', () => {
      const { container } = render(<Skeleton.Chart variant="doughnut" />);

      expect(root(container)).toHaveClass('skeleton-chart-count-6');
    });

    it('clamps slices below the supported range', () => {
      const { container } = render(<Skeleton.Chart variant="pie" count={1} />);

      expect(root(container)).toHaveClass('skeleton-chart-count-2');
    });

    it('clamps slices above the supported range', () => {
      const { container } = render(<Skeleton.Chart variant="pie" count={40} />);

      expect(root(container)).toHaveClass('skeleton-chart-count-12');
    });

    it('falls back to the default slice count for a non-finite count', () => {
      const { container } = render(<Skeleton.Chart variant="pie" count={Number.NaN} />);

      expect(root(container)).toHaveClass('skeleton-chart-count-6');
      expect(root(container)?.className).not.toContain('NaN');
    });
  });
});
