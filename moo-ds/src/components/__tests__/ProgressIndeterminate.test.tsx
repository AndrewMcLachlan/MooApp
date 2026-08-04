import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressIndeterminate } from '../ProgressIndeterminate';

describe('ProgressIndeterminate', () => {
  it('renders with progressbar role', () => {
    render(<ProgressIndeterminate />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('defaults to the inline variant', () => {
    render(<ProgressIndeterminate />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveClass('progress-indeterminate');
    expect(bar).not.toHaveClass('progress-indeterminate-edge');
  });

  it('applies the edge variant class', () => {
    render(<ProgressIndeterminate variant="edge" />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveClass('progress-indeterminate', 'progress-indeterminate-edge');
  });

  it('is busy and indeterminate', () => {
    render(<ProgressIndeterminate />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-busy', 'true');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('defaults aria-label to Loading', () => {
    render(<ProgressIndeterminate />);
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Loading');
  });

  it('accepts a custom aria-label', () => {
    render(<ProgressIndeterminate aria-label="Refreshing chart" />);
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Refreshing chart');
  });

  it('applies custom className', () => {
    render(<ProgressIndeterminate className="custom" />);
    expect(screen.getByRole('progressbar')).toHaveClass('progress-indeterminate', 'custom');
  });

  it('has displayName', () => {
    expect(ProgressIndeterminate.displayName).toBe('ProgressIndeterminate');
  });
});
