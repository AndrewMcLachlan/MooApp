import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Paginaton';

describe('Pagination', () => {
  describe('rendering', () => {
    it('renders pagination controls', () => {
      render(<Pagination pageNumber={1} numberOfPages={5} onChange={() => {}} />);

      // Should have navigation buttons
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders page numbers', () => {
      render(<Pagination pageNumber={3} numberOfPages={5} onChange={() => {}} />);

      // Should show all 5 pages
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('marks current page as active', () => {
      render(<Pagination pageNumber={3} numberOfPages={5} onChange={() => {}} />);

      const activePage = screen.getByText('3').closest('li');
      expect(activePage).toHaveClass('active');
    });

    it('has displayName', () => {
      expect(Pagination.displayName).toBe('Pagination');
    });
  });

  describe('navigation buttons', () => {
    it('disables First and Prev on first page', () => {
      const { container } = render(<Pagination pageNumber={1} numberOfPages={5} onChange={() => {}} />);

      const items = container.querySelectorAll('.page-item');
      // First two items are First and Prev
      expect(items[0]).toHaveClass('disabled');
      expect(items[1]).toHaveClass('disabled');
    });

    it('disables Next and Last on last page', () => {
      const { container } = render(<Pagination pageNumber={5} numberOfPages={5} onChange={() => {}} />);

      const items = container.querySelectorAll('.page-item');
      // Last two items are Next and Last
      expect(items[items.length - 2]).toHaveClass('disabled');
      expect(items[items.length - 1]).toHaveClass('disabled');
    });

    it('enables all navigation on middle page', () => {
      const { container } = render(<Pagination pageNumber={3} numberOfPages={5} onChange={() => {}} />);

      const items = container.querySelectorAll('.page-item');
      // First, Prev should be enabled
      expect(items[0]).not.toHaveClass('disabled');
      expect(items[1]).not.toHaveClass('disabled');
      // Next, Last should be enabled
      expect(items[items.length - 2]).not.toHaveClass('disabled');
      expect(items[items.length - 1]).not.toHaveClass('disabled');
    });
  });

  describe('onChange callbacks', () => {
    it('calls onChange with page 1 when First is clicked', () => {
      const onChange = vi.fn();
      const { container } = render(<Pagination pageNumber={3} numberOfPages={5} onChange={onChange} />);

      const links = container.querySelectorAll('.page-link');
      fireEvent.click(links[0]); // First link

      expect(onChange).toHaveBeenCalledWith(3, 1);
    });

    it('calls onChange with previous page when Prev is clicked', () => {
      const onChange = vi.fn();
      const { container } = render(<Pagination pageNumber={3} numberOfPages={5} onChange={onChange} />);

      const links = container.querySelectorAll('.page-link');
      fireEvent.click(links[1]); // Prev link

      expect(onChange).toHaveBeenCalledWith(3, 2);
    });

    it('calls onChange with next page when Next is clicked', () => {
      const onChange = vi.fn();
      const { container } = render(<Pagination pageNumber={3} numberOfPages={5} onChange={onChange} />);

      const links = container.querySelectorAll('.page-link');
      fireEvent.click(links[links.length - 2]); // Next link

      expect(onChange).toHaveBeenCalledWith(3, 4);
    });

    it('calls onChange with last page when Last is clicked', () => {
      const onChange = vi.fn();
      const { container } = render(<Pagination pageNumber={3} numberOfPages={5} onChange={onChange} />);

      const links = container.querySelectorAll('.page-link');
      fireEvent.click(links[links.length - 1]); // Last link

      expect(onChange).toHaveBeenCalledWith(3, 5);
    });

    it('calls onChange when page number is clicked', () => {
      const onChange = vi.fn();
      render(<Pagination pageNumber={1} numberOfPages={5} onChange={onChange} />);

      fireEvent.click(screen.getByText('4'));

      expect(onChange).toHaveBeenCalledWith(1, 4);
    });

    it('marks Prev as disabled on first page', () => {
      const { container } = render(<Pagination pageNumber={1} numberOfPages={5} onChange={() => {}} />);

      const items = container.querySelectorAll('.page-item');
      // Prev (second item) should be disabled
      expect(items[1]).toHaveClass('disabled');
    });

    it('marks Next as disabled on last page', () => {
      const { container } = render(<Pagination pageNumber={5} numberOfPages={5} onChange={() => {}} />);

      const items = container.querySelectorAll('.page-item');
      // Next (second to last) should be disabled
      expect(items[items.length - 2]).toHaveClass('disabled');
    });
  });

  describe('page display logic', () => {
    it('shows first 5 pages when on page 1 of 10', () => {
      render(<Pagination pageNumber={1} numberOfPages={10} onChange={() => {}} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.queryByText('6')).not.toBeInTheDocument();
    });

    it('shows last 5 pages when on page 10 of 10', () => {
      render(<Pagination pageNumber={10} numberOfPages={10} onChange={() => {}} />);

      expect(screen.queryByText('5')).not.toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('centers around current page in middle', () => {
      render(<Pagination pageNumber={5} numberOfPages={10} onChange={() => {}} />);

      // Should show pages 3, 4, 5, 6, 7
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });
  });

  describe('single page', () => {
    it('shows only page 1 when there is one page', () => {
      render(<Pagination pageNumber={1} numberOfPages={1} onChange={() => {}} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
    });

    it('disables all navigation items on single page', () => {
      const { container } = render(<Pagination pageNumber={1} numberOfPages={1} onChange={() => {}} />);

      const items = container.querySelectorAll('.page-item');
      // First, Prev, Next, Last should all be disabled (items 0, 1, 3, 4)
      // Item 2 is the active page (not disabled)
      expect(items[0]).toHaveClass('disabled'); // First
      expect(items[1]).toHaveClass('disabled'); // Prev
      expect(items[items.length - 2]).toHaveClass('disabled'); // Next
      expect(items[items.length - 1]).toHaveClass('disabled'); // Last
    });
  });
});
