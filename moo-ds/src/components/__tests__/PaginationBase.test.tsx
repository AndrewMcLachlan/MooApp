import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationBase } from '../PaginationBase';

describe('PaginationBase', () => {
  it('renders as ul', () => {
    render(<PaginationBase><PaginationBase.Item>1</PaginationBase.Item></PaginationBase>);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('applies pagination class', () => {
    render(<PaginationBase data-testid="pag"><PaginationBase.Item>1</PaginationBase.Item></PaginationBase>);
    expect(screen.getByTestId('pag')).toHaveClass('pagination');
  });

  it('applies custom className', () => {
    render(<PaginationBase className="custom" data-testid="pag"><PaginationBase.Item>1</PaginationBase.Item></PaginationBase>);
    expect(screen.getByTestId('pag')).toHaveClass('pagination', 'custom');
  });

  it('has displayName', () => {
    expect(PaginationBase.displayName).toBe('Pagination');
  });

  describe('PaginationBase.Item', () => {
    it('renders children', () => {
      render(<PaginationBase><PaginationBase.Item>5</PaginationBase.Item></PaginationBase>);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('applies active class', () => {
      const { container } = render(<PaginationBase><PaginationBase.Item active>1</PaginationBase.Item></PaginationBase>);
      expect(container.querySelector('.page-item.active')).toBeInTheDocument();
    });

    it('applies disabled class', () => {
      const { container } = render(<PaginationBase><PaginationBase.Item disabled>1</PaginationBase.Item></PaginationBase>);
      expect(container.querySelector('.page-item.disabled')).toBeInTheDocument();
    });

    it('calls onClick', () => {
      const onClick = vi.fn();
      render(<PaginationBase><PaginationBase.Item onClick={onClick}>1</PaginationBase.Item></PaginationBase>);
      fireEvent.click(screen.getByText('1'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('navigation items', () => {
    it('renders First with default content', () => {
      render(<PaginationBase><PaginationBase.First /></PaginationBase>);
      expect(screen.getByText('«')).toBeInTheDocument();
    });

    it('renders Prev with default content', () => {
      render(<PaginationBase><PaginationBase.Prev /></PaginationBase>);
      expect(screen.getByText('‹')).toBeInTheDocument();
    });

    it('renders Next with default content', () => {
      render(<PaginationBase><PaginationBase.Next /></PaginationBase>);
      expect(screen.getByText('›')).toBeInTheDocument();
    });

    it('renders Last with default content', () => {
      render(<PaginationBase><PaginationBase.Last /></PaginationBase>);
      expect(screen.getByText('»')).toBeInTheDocument();
    });

    it('has correct displayNames', () => {
      expect(PaginationBase.First.displayName).toBe('Pagination.First');
      expect(PaginationBase.Prev.displayName).toBe('Pagination.Prev');
      expect(PaginationBase.Next.displayName).toBe('Pagination.Next');
      expect(PaginationBase.Last.displayName).toBe('Pagination.Last');
    });
  });
});
