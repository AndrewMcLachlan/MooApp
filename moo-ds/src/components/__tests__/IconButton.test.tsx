import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButton } from '../IconButton';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

describe('IconButton', () => {
  describe('rendering', () => {
    it('renders button with icon and text', () => {
      render(<IconButton icon={faCheck}>Click me</IconButton>);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders FontAwesome icon', () => {
      const { container } = render(<IconButton icon={faCheck}>Click me</IconButton>);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-icon', 'check');
    });

    it('applies btn-icon class', () => {
      render(<IconButton icon={faCheck}>Click me</IconButton>);

      expect(screen.getByRole('button')).toHaveClass('btn-icon');
    });

    it('renders with custom className', () => {
      render(<IconButton icon={faCheck} className="custom-class">Click me</IconButton>);

      expect(screen.getByRole('button')).toHaveClass('custom-class');
      expect(screen.getByRole('button')).toHaveClass('btn-icon');
    });
  });

  describe('button variants', () => {
    it('applies primary variant', () => {
      render(<IconButton icon={faCheck} variant="primary">Primary</IconButton>);

      expect(screen.getByRole('button')).toHaveClass('btn-primary');
    });

    it('applies secondary variant', () => {
      render(<IconButton icon={faCheck} variant="secondary">Secondary</IconButton>);

      expect(screen.getByRole('button')).toHaveClass('btn-secondary');
    });

    it('applies danger variant', () => {
      render(<IconButton icon={faCheck} variant="danger">Danger</IconButton>);

      expect(screen.getByRole('button')).toHaveClass('btn-danger');
    });
  });

  describe('button props', () => {
    it('handles click events', () => {
      const onClick = vi.fn();
      render(<IconButton icon={faCheck} onClick={onClick}>Click me</IconButton>);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      render(<IconButton icon={faCheck} disabled>Disabled</IconButton>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('can have type submit', () => {
      render(<IconButton icon={faCheck} type="submit">Submit</IconButton>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('iconSrc prop', () => {
    it('accepts iconSrc prop', () => {
      const { container } = render(<IconButton iconSrc="/icon.svg">With Src</IconButton>);

      expect(container.querySelector('img')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(IconButton.displayName).toBe('IconButton');
    });
  });
});
