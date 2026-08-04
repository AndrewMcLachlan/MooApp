import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from '../Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack>Content</Stack>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the stack class', () => {
    const { container } = render(<Stack>Content</Stack>);

    expect(container.querySelector('.stack')).toBeInTheDocument();
  });

  it('renders a div by default', () => {
    const { container } = render(<Stack>Content</Stack>);

    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('renders as another element via the as prop', () => {
    const { container } = render(<Stack as="main">Content</Stack>);

    expect(container.querySelector('main.stack')).toBeInTheDocument();
  });

  it('merges a custom className', () => {
    const { container } = render(<Stack className="custom">Content</Stack>);

    expect(container.querySelector('.stack.custom')).toBeInTheDocument();
  });

  it('passes through additional HTML attributes', () => {
    render(<Stack id="my-stack" data-testid="stack">Content</Stack>);

    expect(screen.getByTestId('stack')).toHaveAttribute('id', 'my-stack');
  });

  it('has displayName', () => {
    expect(Stack.displayName).toBe('Stack');
  });
});
