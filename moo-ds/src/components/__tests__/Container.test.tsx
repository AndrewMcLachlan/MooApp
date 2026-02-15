import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from '../Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies container class', () => {
    render(<Container data-testid="c">Content</Container>);
    expect(screen.getByTestId('c')).toHaveClass('container');
  });

  it('applies container-fluid when fluid', () => {
    render(<Container fluid data-testid="c">Content</Container>);
    expect(screen.getByTestId('c')).toHaveClass('container-fluid');
    expect(screen.getByTestId('c')).not.toHaveClass('container');
  });

  it('renders as div by default', () => {
    render(<Container data-testid="c">Content</Container>);
    expect(screen.getByTestId('c').tagName).toBe('DIV');
  });

  it('renders with as prop', () => {
    render(<Container as="section" data-testid="c">Content</Container>);
    expect(screen.getByTestId('c').tagName).toBe('SECTION');
  });

  it('applies custom className', () => {
    render(<Container className="custom" data-testid="c">Content</Container>);
    expect(screen.getByTestId('c')).toHaveClass('container', 'custom');
  });

  it('has displayName', () => {
    expect(Container.displayName).toBe('Container');
  });
});
