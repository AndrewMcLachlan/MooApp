import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SortIcon } from '../SortIcon';

describe('SortIcon', () => {
  describe('rendering', () => {
    it('renders up arrow for ascending', () => {
      const { container } = render(<SortIcon direction="Ascending" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // FontAwesome 6 uses arrow-up-long as the canonical name
      expect(svg).toHaveAttribute('data-icon', 'arrow-up-long');
    });

    it('renders down arrow for descending', () => {
      const { container } = render(<SortIcon direction="Descending" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // FontAwesome 6 uses arrow-down-long as the canonical name
      expect(svg).toHaveAttribute('data-icon', 'arrow-down-long');
    });
  });

  describe('hidden prop', () => {
    it('renders when hidden is false', () => {
      const { container } = render(<SortIcon direction="Ascending" hidden={false} />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders nothing when hidden is true', () => {
      const { container } = render(<SortIcon direction="Ascending" hidden />);

      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('defaults hidden to false', () => {
      const { container } = render(<SortIcon direction="Ascending" />);

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(SortIcon.displayName).toBe('SortIcon');
    });
  });
});
