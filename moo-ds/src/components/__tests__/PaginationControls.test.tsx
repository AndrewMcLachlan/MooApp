import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaginationControls } from '../PaginationControls';
import { PageSize } from '../PageSize';
import { Pagination } from '../Paginaton';

describe('PaginationControls', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <PaginationControls>
          <span data-testid="child">Child content</span>
        </PaginationControls>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies pagination-controls class', () => {
      const { container } = render(
        <PaginationControls>
          <span>Content</span>
        </PaginationControls>
      );

      expect(container.querySelector('.pagination-controls')).toBeInTheDocument();
    });

    it('renders PageSize child', () => {
      render(
        <PaginationControls>
          <PageSize value={10} onChange={() => {}} />
        </PaginationControls>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders Pagination child', () => {
      const { container } = render(
        <PaginationControls>
          <Pagination pageNumber={1} numberOfPages={5} onChange={() => {}} />
        </PaginationControls>
      );

      // Bootstrap Pagination renders as ul.pagination
      expect(container.querySelector('.pagination')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      const { container } = render(
        <PaginationControls>
          <PageSize value={10} onChange={() => {}} />
          <Pagination pageNumber={1} numberOfPages={5} onChange={() => {}} />
        </PaginationControls>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(container.querySelector('.pagination')).toBeInTheDocument();
    });
  });

  describe('warning for invalid children', () => {
    it('warns when non-pagination children are provided', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <PaginationControls>
          <div>Invalid child</div>
        </PaginationControls>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('PaginationControls can only accept PageSize and Pagination'),
        expect.anything()
      );

      consoleSpy.mockRestore();
    });

    it('does not warn for valid PageSize children', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <PaginationControls>
          <PageSize value={10} onChange={() => {}} />
        </PaginationControls>
      );

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(PaginationControls.displayName).toBe('PaginationControls');
    });
  });
});
