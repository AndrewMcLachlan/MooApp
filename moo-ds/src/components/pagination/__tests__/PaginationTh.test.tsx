import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationTh } from '../PaginationTh';

describe('PaginationTh', () => {
  describe('rendering', () => {
    it('renders as th element', () => {
      const { container } = render(
        <table><thead><tr>
          <PaginationTh pageNumber={1} numberOfPages={5} onChange={() => {}}>Column</PaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('th')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <table><thead><tr>
          <PaginationTh pageNumber={1} numberOfPages={5} onChange={() => {}}>Column Header</PaginationTh>
        </tr></thead></table>
      );

      expect(screen.getByText('Column Header')).toBeInTheDocument();
    });

    it('renders mini pagination', () => {
      render(
        <table><thead><tr>
          <PaginationTh pageNumber={1} numberOfPages={5} onChange={() => {}}>Column</PaginationTh>
        </tr></thead></table>
      );

      expect(screen.getByTitle('Previous page')).toBeInTheDocument();
      expect(screen.getByTitle('Next page')).toBeInTheDocument();
    });

    it('applies pagination-th class to wrapper', () => {
      const { container } = render(
        <table><thead><tr>
          <PaginationTh pageNumber={1} numberOfPages={5} onChange={() => {}}>Column</PaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('.pagination-th')).toBeInTheDocument();
    });
  });

  describe('pagination functionality', () => {
    it('calls onChange when next is clicked', () => {
      const onChange = vi.fn();
      render(
        <table><thead><tr>
          <PaginationTh pageNumber={1} numberOfPages={5} onChange={onChange}>Column</PaginationTh>
        </tr></thead></table>
      );

      fireEvent.click(screen.getByTitle('Next page'));

      expect(onChange).toHaveBeenCalledWith(1, 2);
    });

    it('calls onChange when previous is clicked', () => {
      const onChange = vi.fn();
      render(
        <table><thead><tr>
          <PaginationTh pageNumber={3} numberOfPages={5} onChange={onChange}>Column</PaginationTh>
        </tr></thead></table>
      );

      fireEvent.click(screen.getByTitle('Previous page'));

      expect(onChange).toHaveBeenCalledWith(3, 2);
    });
  });

  describe('th props', () => {
    it('passes through th attributes', () => {
      const { container } = render(
        <table><thead><tr>
          <PaginationTh
            pageNumber={1}
            numberOfPages={5}
            onChange={() => {}}
            colSpan={2}
          >Column</PaginationTh>
        </tr></thead></table>
      );

      expect(container.querySelector('th')).toHaveAttribute('colspan', '2');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(PaginationTh.displayName).toBe('PaginationTh');
    });
  });
});
