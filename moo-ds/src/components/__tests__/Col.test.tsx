import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Col } from '../Col';

describe('Col', () => {
  it('renders children', () => {
    render(<Col>Content</Col>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('defaults to col class when no breakpoints specified', () => {
    render(<Col data-testid="col">Content</Col>);
    expect(screen.getByTestId('col')).toHaveClass('col');
  });

  it('applies xs column class', () => {
    render(<Col xs={6} data-testid="col">Content</Col>);
    expect(screen.getByTestId('col')).toHaveClass('col-6');
  });

  it('applies sm column class', () => {
    render(<Col sm={4} data-testid="col">Content</Col>);
    expect(screen.getByTestId('col')).toHaveClass('col-sm-4');
  });

  it('applies md column class', () => {
    render(<Col md={8} data-testid="col">Content</Col>);
    expect(screen.getByTestId('col')).toHaveClass('col-md-8');
  });

  it('applies lg column class', () => {
    render(<Col lg={3} data-testid="col">Content</Col>);
    expect(screen.getByTestId('col')).toHaveClass('col-lg-3');
  });

  it('applies multiple breakpoints', () => {
    render(<Col xs={12} md={6} lg={4} data-testid="col">Content</Col>);
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('col-12', 'col-md-6', 'col-lg-4');
  });

  it('supports boolean breakpoint for auto-width', () => {
    render(<Col sm={true} data-testid="col">Content</Col>);
    expect(screen.getByTestId('col')).toHaveClass('col-sm');
  });

  it('renders as div by default', () => {
    render(<Col data-testid="col">Content</Col>);
    expect(screen.getByTestId('col').tagName).toBe('DIV');
  });

  it('renders with as prop', () => {
    render(<Col as="span" data-testid="col">Content</Col>);
    expect(screen.getByTestId('col').tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Col className="custom" data-testid="col">Content</Col>);
    expect(screen.getByTestId('col')).toHaveClass('col', 'custom');
  });

  it('has displayName', () => {
    expect(Col.displayName).toBe('Col');
  });
});
