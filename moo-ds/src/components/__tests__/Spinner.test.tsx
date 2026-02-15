import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders visually hidden loading text', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('defaults to border animation', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveClass('spinner-border');
  });

  it('supports grow animation', () => {
    render(<Spinner animation="grow" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-grow');
  });

  it('applies sm size for border', () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-border-sm');
  });

  it('applies sm size for grow', () => {
    render(<Spinner animation="grow" size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-grow-sm');
  });

  it('renders as div by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status').tagName).toBe('DIV');
  });

  it('renders with as prop', () => {
    render(<Spinner as="span" />);
    expect(screen.getByRole('status').tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Spinner className="custom" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-border', 'custom');
  });

  it('has displayName', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });
});
