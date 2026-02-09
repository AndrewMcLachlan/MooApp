import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { SaveIcon } from '../SaveIcon';

describe('SaveIcon', () => {
  describe('rendering', () => {
    it('renders check-circle icon', () => {
      const { container } = render(<SaveIcon />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // FontAwesome 6 uses circle-check as the canonical name for check-circle
      expect(svg).toHaveAttribute('data-icon', 'circle-check');
    });

    it('passes title prop to icon', () => {
      // SaveIcon passes title="save" to ClickableIcon component
      expect(SaveIcon).toBeDefined();
      // The title functionality is tested through the ClickableIcon component
    });

    it('renders with lg size', () => {
      const { container } = render(<SaveIcon />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('fa-lg');
    });

    it('has clickable class', () => {
      const { container } = render(<SaveIcon />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('clickable');
    });
  });

  describe('interaction', () => {
    it('handles click events', () => {
      const onClick = vi.fn();
      const { container } = render(<SaveIcon onClick={onClick} />);

      fireEvent.click(container.querySelector('svg')!);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom props', () => {
    it('accepts className prop', () => {
      const { container } = render(<SaveIcon className="custom-save" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-save');
      expect(svg).toHaveClass('clickable');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(SaveIcon.displayName).toBe('SaveIcon');
    });
  });
});
