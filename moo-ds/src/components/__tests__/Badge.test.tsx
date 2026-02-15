import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies badge class', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveClass('badge');
  });

  it('defaults to primary bg', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveClass('bg-primary');
  });

  it('applies custom bg', () => {
    render(<Badge bg="danger">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-danger');
  });

  it('applies pill class', () => {
    render(<Badge pill>Pill</Badge>);
    expect(screen.getByText('Pill')).toHaveClass('rounded-pill');
  });

  it('does not apply pill class by default', () => {
    render(<Badge>Normal</Badge>);
    expect(screen.getByText('Normal')).not.toHaveClass('rounded-pill');
  });

  it('applies custom className', () => {
    render(<Badge className="custom">Badge</Badge>);
    expect(screen.getByText('Badge')).toHaveClass('badge', 'custom');
  });

  it('renders as span', () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText('Tag').tagName).toBe('SPAN');
  });

  it('has displayName', () => {
    expect(Badge.displayName).toBe('Badge');
  });
});
