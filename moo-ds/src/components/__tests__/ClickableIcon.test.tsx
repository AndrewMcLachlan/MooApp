import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ClickableIcon } from '../ClickableIcon';

describe('ClickableIcon', () => {
  describe('rendering', () => {
    it('renders FontAwesome icon', () => {
      const { container } = render(<ClickableIcon icon="check" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-icon', 'check');
    });

    it('applies clickable class', () => {
      const { container } = render(<ClickableIcon icon="check" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('clickable');
    });

    it('combines clickable with custom className', () => {
      const { container } = render(<ClickableIcon icon="check" className="custom-class" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('clickable');
      expect(svg).toHaveClass('custom-class');
    });
  });

  describe('interaction', () => {
    it('handles click events', () => {
      const onClick = vi.fn();
      const { container } = render(<ClickableIcon icon="check" onClick={onClick} />);

      fireEvent.click(container.querySelector('svg')!);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('icon props', () => {
    it('accepts size prop', () => {
      const { container } = render(<ClickableIcon icon="check" size="2x" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fa-2x');
    });

    it('accepts different icons', () => {
      const { container } = render(<ClickableIcon icon="xmark" />);

      const svg = container.querySelector('svg');
      // FontAwesome 6 uses xmark as the canonical name for times
      expect(svg).toHaveAttribute('data-icon', 'xmark');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ClickableIcon.displayName).toBe('ClickableIcon');
    });
  });
});
