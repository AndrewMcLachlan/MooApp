import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MiniPagination } from '../MiniPagination';

describe('MiniPagination', () => {
  describe('rendering', () => {
    it('renders previous and next buttons', () => {
      render(<MiniPagination pageNumber={1} numberOfPages={5} onChange={() => {}} />);

      expect(screen.getByTitle('Previous page')).toBeInTheDocument();
      expect(screen.getByTitle('Next page')).toBeInTheDocument();
    });
  });

  describe('navigation buttons state', () => {
    it('disables previous on first page', () => {
      render(<MiniPagination pageNumber={1} numberOfPages={5} onChange={() => {}} />);

      expect(screen.getByTitle('Previous page').closest('li')).toHaveClass('disabled');
    });

    it('enables previous on pages after first', () => {
      render(<MiniPagination pageNumber={2} numberOfPages={5} onChange={() => {}} />);

      expect(screen.getByTitle('Previous page').closest('li')).not.toHaveClass('disabled');
    });

    it('disables next on last page', () => {
      render(<MiniPagination pageNumber={5} numberOfPages={5} onChange={() => {}} />);

      expect(screen.getByTitle('Next page').closest('li')).toHaveClass('disabled');
    });

    it('enables next on pages before last', () => {
      render(<MiniPagination pageNumber={4} numberOfPages={5} onChange={() => {}} />);

      expect(screen.getByTitle('Next page').closest('li')).not.toHaveClass('disabled');
    });

    it('disables both on single page', () => {
      render(<MiniPagination pageNumber={1} numberOfPages={1} onChange={() => {}} />);

      expect(screen.getByTitle('Previous page').closest('li')).toHaveClass('disabled');
      expect(screen.getByTitle('Next page').closest('li')).toHaveClass('disabled');
    });
  });

  describe('onChange callback', () => {
    it('calls onChange with previous page when previous clicked', () => {
      const onChange = vi.fn();
      render(<MiniPagination pageNumber={3} numberOfPages={5} onChange={onChange} />);

      fireEvent.click(screen.getByTitle('Previous page'));

      expect(onChange).toHaveBeenCalledWith(3, 2);
    });

    it('calls onChange with next page when next clicked', () => {
      const onChange = vi.fn();
      render(<MiniPagination pageNumber={3} numberOfPages={5} onChange={onChange} />);

      fireEvent.click(screen.getByTitle('Next page'));

      expect(onChange).toHaveBeenCalledWith(3, 4);
    });

    it('does not go below page 1', () => {
      const onChange = vi.fn();
      render(<MiniPagination pageNumber={1} numberOfPages={5} onChange={onChange} />);

      fireEvent.click(screen.getByTitle('Previous page'));

      expect(onChange).toHaveBeenCalledWith(1, 1);
    });

    it('does not go above numberOfPages', () => {
      const onChange = vi.fn();
      render(<MiniPagination pageNumber={5} numberOfPages={5} onChange={onChange} />);

      fireEvent.click(screen.getByTitle('Next page'));

      expect(onChange).toHaveBeenCalledWith(5, 5);
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(MiniPagination.displayName).toBe('MiniPagination');
    });
  });
});
