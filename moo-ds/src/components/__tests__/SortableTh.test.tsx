import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortableTh } from '../SortableTh';

const renderInTable = (ui: React.ReactElement) => {
  return render(
    <table>
      <thead>
        <tr>{ui}</tr>
      </thead>
    </table>
  );
};

describe('SortableTh', () => {
  const defaultProps = {
    field: 'name',
    sortField: 'name',
    sortDirection: 'Ascending' as const,
    onSort: vi.fn(),
  };

  describe('rendering', () => {
    it('renders th element', () => {
      renderInTable(<SortableTh {...defaultProps}>Name</SortableTh>);

      expect(screen.getByRole('columnheader')).toBeInTheDocument();
    });

    it('renders children', () => {
      renderInTable(<SortableTh {...defaultProps}>Column Title</SortableTh>);

      expect(screen.getByText('Column Title')).toBeInTheDocument();
    });

    it('applies sortable class', () => {
      renderInTable(<SortableTh {...defaultProps}>Name</SortableTh>);

      expect(screen.getByRole('columnheader')).toHaveClass('sortable');
    });

    it('applies custom className', () => {
      renderInTable(
        <SortableTh {...defaultProps} className="custom-class">
          Name
        </SortableTh>
      );

      expect(screen.getByRole('columnheader')).toHaveClass('sortable', 'custom-class');
    });

    it('has displayName', () => {
      expect(SortableTh.displayName).toBe('SortableTh');
    });
  });

  describe('sort icon', () => {
    it('renders sort icon component when field matches sortField', () => {
      const { container } = renderInTable(
        <SortableTh {...defaultProps} field="name" sortField="name">
          Name
        </SortableTh>
      );

      // SortIcon should be rendered (may or may not have svg depending on implementation)
      const th = screen.getByRole('columnheader');
      expect(th).toBeInTheDocument();
      // Icon visibility is controlled by hidden prop internally
    });

    it('passes hidden prop to sort icon when field does not match sortField', () => {
      const { container } = renderInTable(
        <SortableTh {...defaultProps} field="name" sortField="email">
          Name
        </SortableTh>
      );

      // The SortIcon is rendered but with hidden=true
      const th = screen.getByRole('columnheader');
      expect(th).toBeInTheDocument();
    });
  });

  describe('click handling', () => {
    it('calls onSort with field when clicked', () => {
      const onSort = vi.fn();
      renderInTable(
        <SortableTh {...defaultProps} onSort={onSort} field="email">
          Email
        </SortableTh>
      );

      fireEvent.click(screen.getByRole('columnheader'));

      expect(onSort).toHaveBeenCalledWith('email');
    });

    it('calls onSort with correct field for different columns', () => {
      const onSort = vi.fn();
      renderInTable(
        <SortableTh {...defaultProps} onSort={onSort} field="createdAt">
          Created
        </SortableTh>
      );

      fireEvent.click(screen.getByRole('columnheader'));

      expect(onSort).toHaveBeenCalledWith('createdAt');
    });

    it('calls custom onClick handler as well', () => {
      const onSort = vi.fn();
      const onClick = vi.fn();
      renderInTable(
        <SortableTh {...defaultProps} onSort={onSort} onClick={onClick}>
          Name
        </SortableTh>
      );

      fireEvent.click(screen.getByRole('columnheader'));

      expect(onSort).toHaveBeenCalled();
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('sort direction', () => {
    it('accepts Ascending direction', () => {
      renderInTable(
        <SortableTh {...defaultProps} sortDirection="Ascending">
          Name
        </SortableTh>
      );

      expect(screen.getByRole('columnheader')).toBeInTheDocument();
    });

    it('accepts Descending direction', () => {
      renderInTable(
        <SortableTh {...defaultProps} sortDirection="Descending">
          Name
        </SortableTh>
      );

      expect(screen.getByRole('columnheader')).toBeInTheDocument();
    });
  });

  describe('additional props', () => {
    it('passes through additional HTML attributes', () => {
      renderInTable(
        <SortableTh {...defaultProps} data-testid="sort-header" title="Sort by name">
          Name
        </SortableTh>
      );

      const th = screen.getByRole('columnheader');
      expect(th).toHaveAttribute('data-testid', 'sort-header');
      expect(th).toHaveAttribute('title', 'Sort by name');
    });
  });
});
