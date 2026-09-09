import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../FilterBar';
import { FilterChip } from '../FilterChip';

describe('FilterBar', () => {
  it('renders the primary slot', () => {
    render(<FilterBar primary={<span>Jan – Jun 2026</span>} onOpenFilters={vi.fn()} />);
    expect(screen.getByText('Jan – Jun 2026')).toBeInTheDocument();
  });

  it('calls onOpenFilters when the button is clicked', () => {
    const onOpenFilters = vi.fn();
    render(<FilterBar onOpenFilters={onOpenFilters} />);
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    expect(onOpenFilters).toHaveBeenCalledTimes(1);
  });

  it('shows the active count when there is one', () => {
    render(<FilterBar activeCount={2} onOpenFilters={vi.fn()} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows no count when nothing is active', () => {
    const { container } = render(<FilterBar activeCount={0} onOpenFilters={vi.fn()} />);
    expect(container.querySelector('.filter-bar-count')).not.toBeInTheDocument();
  });

  it('omits the chip row when there are no chips', () => {
    const { container } = render(<FilterBar onOpenFilters={vi.fn()} />);
    expect(container.querySelector('.filter-bar-chips')).not.toBeInTheDocument();
  });

  it('renders chips and a clear control when given both', () => {
    const onClear = vi.fn();
    render(
      <FilterBar onOpenFilters={vi.fn()} onClear={onClear}>
        <FilterChip onRemove={vi.fn()}>Groceries</FilterChip>
      </FilterBar>
    );
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

describe('FilterChip', () => {
  it('calls onRemove when dismissed', () => {
    const onRemove = vi.fn();
    render(<FilterChip onRemove={onRemove}>Groceries</FilterChip>);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Groceries' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('accepts an explicit remove label', () => {
    render(<FilterChip onRemove={vi.fn()} removeLabel="Remove tag filter"><em>Groceries</em></FilterChip>);
    expect(screen.getByRole('button', { name: 'Remove tag filter' })).toBeInTheDocument();
  });
});
