import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingTableRow } from '../LoadingTableRow';

const renderInTable = (ui: React.ReactElement) => {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>
  );
};

describe('LoadingTableRow', () => {
  describe('rendering', () => {
    it('renders a table row', () => {
      renderInTable(<LoadingTableRow cols={3} />);

      expect(screen.getByRole('row')).toBeInTheDocument();
    });

    it('renders correct number of cells', () => {
      renderInTable(<LoadingTableRow cols={5} />);

      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(5);
    });

    it('renders single cell', () => {
      renderInTable(<LoadingTableRow cols={1} />);

      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(1);
    });

    it('renders many cells', () => {
      renderInTable(<LoadingTableRow cols={10} />);

      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(10);
    });

    it('has displayName', () => {
      expect(LoadingTableRow.displayName).toBe('LoadingTableRow');
    });
  });

  describe('cell content', () => {
    it('renders non-breaking space in each cell', () => {
      renderInTable(<LoadingTableRow cols={3} />);

      const cells = screen.getAllByRole('cell');
      cells.forEach(cell => {
        // Non-breaking space is \u00A0
        expect(cell.innerHTML).toBe('&nbsp;');
      });
    });
  });

  describe('edge cases', () => {
    it('renders no cells when cols is 0', () => {
      renderInTable(<LoadingTableRow cols={0} />);

      const cells = screen.queryAllByRole('cell');
      expect(cells).toHaveLength(0);
    });
  });
});
