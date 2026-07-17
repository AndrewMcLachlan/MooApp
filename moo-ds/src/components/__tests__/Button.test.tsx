import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders as button element', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('defaults to type="button"', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('applies btn class', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn');
    });

    it('has displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('variants', () => {
    it('defaults to primary', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-primary');
    });

    it.each([
      'primary', 'outline-primary', 'secondary', 'outline-secondary',
      'danger', 'outline-danger', 'warning', 'outline-warning',
      'success', 'outline-success', 'link',
    ] as const)('supports %s variant', (variant) => {
      render(<Button variant={variant}>Click</Button>);
      expect(screen.getByRole('button')).toHaveClass(`btn-${variant}`);
    });
  });

  describe('sizes', () => {
    it('applies sm size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-sm');
    });

    it('applies lg size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-lg');
    });
  });

  describe('as prop', () => {
    it('renders as custom element', () => {
      render(<Button as="a" href="/test">Link</Button>);
      expect(screen.getByText('Link').tagName).toBe('A');
    });

    it('does not apply type when not a button', () => {
      render(<Button as="a">Link</Button>);
      expect(screen.getByText('Link')).not.toHaveAttribute('type');
    });
  });

  describe('active', () => {
    it('applies active class', () => {
      render(<Button active>Active</Button>);
      expect(screen.getByRole('button')).toHaveClass('active');
    });
  });

  describe('interaction', () => {
    it('calls onClick', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick while loading', () => {
      const onClick = vi.fn();
      render(<Button loading onClick={onClick}>Save</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick while loading for non-button elements', () => {
      const onClick = vi.fn();
      render(<Button as="a" href="#" loading onClick={onClick}>Save</Button>);
      fireEvent.click(screen.getByText('Save'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled for non-button elements', () => {
      const onClick = vi.fn();
      render(<Button as="a" href="#" disabled onClick={onClick}>Go</Button>);
      fireEvent.click(screen.getByText('Go'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    it('renders a spinner', () => {
      const { container } = render(<Button loading>Save</Button>);
      expect(container.querySelector('.btn-spinner')).toBeInTheDocument();
    });

    it('keeps the label alongside the spinner', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('disables the button and marks it busy', () => {
      render(<Button loading>Save</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('adds the btn-loading class', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-loading');
    });

    it('does not render a spinner when not loading', () => {
      const { container } = render(<Button>Save</Button>);
      expect(container.querySelector('.btn-spinner')).not.toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(<Button className="custom">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn', 'custom');
  });
});
