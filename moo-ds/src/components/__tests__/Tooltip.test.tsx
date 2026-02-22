import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  describe('rendering', () => {
    it('renders tooltip icon', () => {
      const { container } = render(<Tooltip id="test">Tooltip content</Tooltip>);

      expect(container.querySelector('.tooltip-icon')).toBeInTheDocument();
    });

    it('renders with FontAwesome info-circle icon', () => {
      const { container } = render(<Tooltip id="test">Tooltip content</Tooltip>);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // FontAwesome 6 uses circle-info as the canonical name for info-circle
      expect(svg).toHaveAttribute('data-icon', 'circle-info');
    });

    it('shows tooltip content on hover', () => {
      const { container } = render(<Tooltip id="test">Tooltip content</Tooltip>);

      const wrapper = container.querySelector('.tooltip-wrapper')!;
      fireEvent.mouseEnter(wrapper);

      expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip content');
    });

    it('hides tooltip content on mouse leave', () => {
      const { container } = render(<Tooltip id="test">Tooltip content</Tooltip>);

      const wrapper = container.querySelector('.tooltip-wrapper')!;
      fireEvent.mouseEnter(wrapper);
      fireEvent.mouseLeave(wrapper);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders with focusable icon span', () => {
      const { container } = render(<Tooltip id="accessibility-test">Accessible tooltip</Tooltip>);

      const iconSpan = container.querySelector('.tooltip-icon');
      expect(iconSpan).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Tooltip.displayName).toBe('Tooltip');
    });
  });
});
