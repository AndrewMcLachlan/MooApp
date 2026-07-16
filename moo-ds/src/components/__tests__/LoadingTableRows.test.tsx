import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingTableRows } from '../LoadingTableRows';

describe('LoadingTableRows', () => {
  describe('rendering', () => {
    it('renders specified number of rows', () => {
      const { container } = render(
        <table><tbody><LoadingTableRows rows={5} cols={3} /></tbody></table>
      );

      const rows = container.querySelectorAll('tr');
      expect(rows).toHaveLength(5);
    });

    it('renders correct number of columns per row', () => {
      const { container } = render(
        <table><tbody><LoadingTableRows rows={2} cols={4} /></tbody></table>
      );

      const firstRow = container.querySelector('tr');
      const cells = firstRow?.querySelectorAll('td');
      expect(cells).toHaveLength(4);
    });

    it('renders zero rows when rows is 0', () => {
      const { container } = render(
        <table><tbody><LoadingTableRows rows={0} cols={3} /></tbody></table>
      );

      const rows = container.querySelectorAll('tr');
      expect(rows).toHaveLength(0);
    });

    it('renders single row', () => {
      const { container } = render(
        <table><tbody><LoadingTableRows rows={1} cols={2} /></tbody></table>
      );

      const rows = container.querySelectorAll('tr');
      expect(rows).toHaveLength(1);
    });
  });

  describe('cell content', () => {
    it('renders a skeleton placeholder in each cell', () => {
      const { container } = render(
        <table><tbody><LoadingTableRows rows={1} cols={3} /></tbody></table>
      );

      const cells = container.querySelectorAll('td');
      expect(cells).toHaveLength(3);
      cells.forEach(cell => {
        expect(cell.querySelector('.skeleton')).toBeInTheDocument();
      });
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(LoadingTableRows.displayName).toBe('LoadingTableRows');
    });
  });
});
