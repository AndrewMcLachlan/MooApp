import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CloseBadge } from '../CloseBadge';

describe('CloseBadge', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<CloseBadge>Badge Text</CloseBadge>);

      expect(screen.getByText('Badge Text')).toBeInTheDocument();
    });

    it('renders close icon', () => {
      const { container } = render(<CloseBadge>Badge</CloseBadge>);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // FontAwesome 6 uses circle-xmark as the canonical name for times-circle
      expect(svg).toHaveAttribute('data-icon', 'circle-xmark');
    });

    it('applies close-badge class', () => {
      const { container } = render(<CloseBadge>Badge</CloseBadge>);

      expect(container.querySelector('.close-badge')).toBeInTheDocument();
    });

    it('combines close-badge with custom className', () => {
      const { container } = render(<CloseBadge className="custom-class">Badge</CloseBadge>);

      const badge = container.querySelector('.badge');
      expect(badge).toHaveClass('close-badge');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('onClose callback', () => {
    it('calls onClose when close icon is clicked', () => {
      const onClose = vi.fn();
      const { container } = render(<CloseBadge onClose={onClose}>Badge</CloseBadge>);

      fireEvent.click(container.querySelector('svg')!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('stops event propagation when close icon is clicked', () => {
      const onClose = vi.fn();
      const parentClick = vi.fn();

      const { container } = render(
        <div onClick={parentClick}>
          <CloseBadge onClose={onClose}>Badge</CloseBadge>
        </div>
      );

      fireEvent.click(container.querySelector('svg')!);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(parentClick).not.toHaveBeenCalled();
    });

    it('does not throw when onClose is not provided', () => {
      const { container } = render(<CloseBadge>Badge</CloseBadge>);

      expect(() => {
        fireEvent.click(container.querySelector('svg')!);
      }).not.toThrow();
    });
  });

  describe('badge props', () => {
    it('accepts bg prop for background color', () => {
      const { container } = render(<CloseBadge bg="primary">Badge</CloseBadge>);

      expect(container.querySelector('.badge')).toHaveClass('bg-primary');
    });

    it('accepts pill prop', () => {
      const { container } = render(<CloseBadge pill>Badge</CloseBadge>);

      expect(container.querySelector('.badge')).toHaveClass('rounded-pill');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(CloseBadge.displayName).toBe('CloseBadge');
    });
  });
});
