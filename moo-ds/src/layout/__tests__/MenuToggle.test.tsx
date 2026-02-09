import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuToggle } from '../MenuToggle';

describe('MenuToggle', () => {
  describe('rendering', () => {
    it('renders button', () => {
      render(<MenuToggle onClick={() => {}} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders hamburger menu icon', () => {
      const { container } = render(<MenuToggle onClick={() => {}} />);

      expect(container.querySelector('#menu-toggle')).toBeInTheDocument();
    });

    it('applies btn-hamburger class', () => {
      render(<MenuToggle onClick={() => {}} />);

      expect(screen.getByRole('button')).toHaveClass('btn-hamburger');
    });

    it('applies btn class', () => {
      render(<MenuToggle onClick={() => {}} />);

      expect(screen.getByRole('button')).toHaveClass('btn');
    });
  });

  describe('accessibility', () => {
    it('has aria-controls for sidebar', () => {
      render(<MenuToggle onClick={() => {}} />);

      expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'sidebar');
    });

    it('has aria-label', () => {
      render(<MenuToggle onClick={() => {}} />);

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Menu');
    });

    it('has title', () => {
      render(<MenuToggle onClick={() => {}} />);

      expect(screen.getByRole('button')).toHaveAttribute('title', 'Menu');
    });
  });

  describe('interaction', () => {
    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<MenuToggle onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('SVG structure', () => {
    it('renders SVG with correct viewBox', () => {
      const { container } = render(<MenuToggle onClick={() => {}} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
    });

    it('renders three menu lines', () => {
      const { container } = render(<MenuToggle onClick={() => {}} />);

      const paths = container.querySelectorAll('path');
      expect(paths).toHaveLength(3);
    });
  });
});
