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

  describe('badge', () => {
    it('applies btn-icon-badge class and wraps the icon in a panel when badge is true', () => {
      const { container } = render(<IconButton icon={faCheck} badge>Add</IconButton>);

      expect(screen.getByRole('button')).toHaveClass('btn-icon-badge');
      const panel = container.querySelector('.btn-icon-panel');
      expect(panel).toBeInTheDocument();
      expect(panel?.querySelector('svg')).toBeInTheDocument();
    });

    it('omits the badge class and panel wrapper by default', () => {
      const { container } = render(<IconButton icon={faCheck}>Add</IconButton>);

      expect(screen.getByRole('button')).not.toHaveClass('btn-icon-badge');
      expect(container.querySelector('.btn-icon-panel')).not.toBeInTheDocument();
    });
  });

  describe('loading', () => {
    it('replaces the icon with a spinner', () => {
      const { container } = render(<IconButton icon={faCheck} loading>Save</IconButton>);

      expect(container.querySelector('.spinner-border')).toBeInTheDocument();
      expect(container.querySelector('svg[data-icon="check"]')).not.toBeInTheDocument();
    });

    it('renders the spinner inside the panel for the badge variant', () => {
      const { container } = render(<IconButton icon={faCheck} badge loading>Add</IconButton>);

      const panel = container.querySelector('.btn-icon-panel');
      expect(panel?.querySelector('.spinner-border')).toBeInTheDocument();
    });

    it('keeps the label', () => {
      render(<IconButton icon={faCheck} loading>Save</IconButton>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('disables the button and marks it busy', () => {
      render(<IconButton icon={faCheck} loading>Save</IconButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('does not render a second (leading) spinner', () => {
      const { container } = render(<IconButton icon={faCheck} loading>Save</IconButton>);
      expect(container.querySelectorAll('.spinner-border')).toHaveLength(1);
    });

    it('does not call onClick while loading', () => {
      const onClick = vi.fn();
      render(<IconButton icon={faCheck} loading onClick={onClick}>Save</IconButton>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
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
