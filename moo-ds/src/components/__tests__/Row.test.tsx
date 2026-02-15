import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Row } from '../Row';

describe('Row', () => {
  it('renders children', () => {
    render(<Row>Content</Row>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies row class', () => {
    render(<Row data-testid="row">Content</Row>);
    expect(screen.getByTestId('row')).toHaveClass('row');
  });

  it('renders as div by default', () => {
    render(<Row data-testid="row">Content</Row>);
    expect(screen.getByTestId('row').tagName).toBe('DIV');
  });

  it('renders with as prop', () => {
    render(<Row as="section" data-testid="row">Content</Row>);
    expect(screen.getByTestId('row').tagName).toBe('SECTION');
  });

  it('applies custom className', () => {
    render(<Row className="custom" data-testid="row">Content</Row>);
    expect(screen.getByTestId('row')).toHaveClass('row', 'custom');
  });

  it('has displayName', () => {
    expect(Row.displayName).toBe('Row');
  });
});
