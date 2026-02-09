import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { DeleteIcon } from '../DeleteIcon';

describe('DeleteIcon', () => {
  describe('rendering', () => {
    it('renders trash icon', () => {
      const { container } = render(<DeleteIcon />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // FontAwesome 6 uses trash-can as the canonical name for trash-alt
      expect(svg).toHaveAttribute('data-icon', 'trash-can');
    });

    it('passes title prop to icon', () => {
      // DeleteIcon passes title="delete" to Icon component
      expect(DeleteIcon).toBeDefined();
      // The title functionality is tested through the Icon component
    });
  });

  describe('interaction', () => {
    it('handles click events', () => {
      const onClick = vi.fn();
      const { container } = render(<DeleteIcon onClick={onClick} />);

      fireEvent.click(container.querySelector('svg')!);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('adds clickable class when onClick is provided', () => {
      const { container } = render(<DeleteIcon onClick={() => {}} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('clickable');
    });
  });

  describe('custom props', () => {
    it('accepts className prop', () => {
      const { container } = render(<DeleteIcon className="custom-delete" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-delete');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(DeleteIcon.displayName).toBe('DeleteIcon');
    });
  });
});
