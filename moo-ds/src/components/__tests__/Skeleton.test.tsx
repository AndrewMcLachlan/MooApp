import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  describe('base', () => {
    it('renders a rect placeholder by default', () => {
      const { container } = render(<Skeleton data-testid="s" />);
      const el = screen.getByTestId('s');
      expect(el).toHaveClass('skeleton');
      expect(el).toHaveClass('skeleton-rect');
      expect(container.querySelector('.skeleton')).toBeInTheDocument();
    });

    it('applies the requested variant', () => {
      render(<Skeleton variant="circle" data-testid="s" />);
      expect(screen.getByTestId('s')).toHaveClass('skeleton-circle');
    });

    it('is decorative (aria-hidden)', () => {
      render(<Skeleton data-testid="s" />);
      expect(screen.getByTestId('s')).toHaveAttribute('aria-hidden', 'true');
    });

    it('merges consumer className', () => {
      render(<Skeleton className="extra" data-testid="s" />);
      expect(screen.getByTestId('s')).toHaveClass('extra');
    });

    it('can render as a different element', () => {
      render(<Skeleton as="div" data-testid="s" />);
      expect(screen.getByTestId('s').tagName).toBe('DIV');
    });

    it('has displayName', () => {
      expect(Skeleton.displayName).toBe('Skeleton');
    });
  });

  describe('Skeleton.Text', () => {
    it('renders a single line by default', () => {
      const { container } = render(<Skeleton.Text />);
      expect(container.querySelectorAll('.skeleton-text-line')).toHaveLength(1);
    });

    it('renders the requested number of lines', () => {
      const { container } = render(<Skeleton.Text lines={3} />);
      expect(container.querySelectorAll('.skeleton-text-line')).toHaveLength(3);
    });

    it('is decorative (aria-hidden)', () => {
      render(<Skeleton.Text data-testid="t" />);
      expect(screen.getByTestId('t')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Skeleton.Circle', () => {
    it('defaults to md size', () => {
      render(<Skeleton.Circle data-testid="c" />);
      const el = screen.getByTestId('c');
      expect(el).toHaveClass('skeleton-circle');
      expect(el).toHaveClass('skeleton-circle-md');
    });

    it('applies the requested size', () => {
      render(<Skeleton.Circle size="lg" data-testid="c" />);
      expect(screen.getByTestId('c')).toHaveClass('skeleton-circle-lg');
    });
  });

  describe('Skeleton.Rect', () => {
    it('renders a rect', () => {
      render(<Skeleton.Rect data-testid="r" />);
      expect(screen.getByTestId('r')).toHaveClass('skeleton-rect');
    });
  });
});
