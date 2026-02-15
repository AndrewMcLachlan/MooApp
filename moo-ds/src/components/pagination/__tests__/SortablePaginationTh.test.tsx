import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortablePaginationTh } from '../SortablePaginationTh';

describe('SortablePaginationTh', () => {
  const defaultProps = {
    field: 'name',
    sortField: 'name',
    sortDirection: 'Ascending' as const,
    onSort: vi.fn(),
    pageNumber: 1,
    numberOfPages: 5,
    onChange: vi.fn(),
  };

  describe('rendering', () => {
    it('renders as th element', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps}>Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('th')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps}>Column Header</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(screen.getByText('Column Header')).toBeInTheDocument();
    });

    it('applies sortable class', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps}>Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('th')).toHaveClass('sortable');
    });

    it('applies custom className', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} className="custom-class">Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('th')).toHaveClass('custom-class');
      expect(container.querySelector('th')).toHaveClass('sortable');
    });

    it('renders mini pagination', () => {
      render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps}>Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(screen.getByTitle('Previous page')).toBeInTheDocument();
      expect(screen.getByTitle('Next page')).toBeInTheDocument();
    });

    it('applies pagination-th class to wrapper', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps}>Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('.pagination-th')).toBeInTheDocument();
    });
  });

  describe('sort icon', () => {
    it('shows sort icon when field matches sortField', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} field="name" sortField="name">Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('svg[data-icon="arrow-up-long"]')).toBeInTheDocument();
    });

    it('hides sort icon when field does not match sortField', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} field="name" sortField="other">Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('svg[data-icon="arrow-up-long"]')).not.toBeInTheDocument();
      expect(container.querySelector('svg[data-icon="arrow-down-long"]')).not.toBeInTheDocument();
    });

    it('shows up arrow for ascending', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} sortDirection="Ascending">Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('svg[data-icon="arrow-up-long"]')).toBeInTheDocument();
    });

    it('shows down arrow for descending', () => {
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} sortDirection="Descending">Column</SortablePaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('svg[data-icon="arrow-down-long"]')).toBeInTheDocument();
    });
  });

  describe('sort callback', () => {
    it('calls onSort when header is clicked', () => {
      const onSort = vi.fn();
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} onSort={onSort}>Column</SortablePaginationTh>
        </tr></thead></table>
      );

      fireEvent.click(container.querySelector('th')!);

      expect(onSort).toHaveBeenCalledWith('name');
    });

    it('calls onClick along with onSort', () => {
      const onSort = vi.fn();
      const onClick = vi.fn();
      const { container } = render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} onSort={onSort} onClick={onClick}>Column</SortablePaginationTh>
        </tr></thead></table>
      );

      fireEvent.click(container.querySelector('th')!);

      expect(onSort).toHaveBeenCalledWith('name');
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('pagination callback', () => {
    it('calls onChange when next is clicked', () => {
      const onChange = vi.fn();
      render(
        <table><thead><tr>
          <SortablePaginationTh {...defaultProps} onChange={onChange}>Column</SortablePaginationTh>
        </tr></thead></table>
      );

      fireEvent.click(screen.getByTitle('Next page'));

      expect(onChange).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(SortablePaginationTh.displayName).toBe('SortablePaginationTh');
    });
  });
});
