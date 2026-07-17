import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from '../Table';

const sampleTable = (props = {}) => (
  <Table {...props}>
    <thead>
      <tr><th>Name</th><th>Role</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Alice</td><td>Admin</td><td>Active</td></tr>
      <tr><td>Bob</td><td>Editor</td><td>Active</td></tr>
    </tbody>
    <tfoot>
      <tr><td colSpan={3}>Footer</td></tr>
    </tfoot>
  </Table>
);

describe('Table', () => {
  describe('rendering', () => {
    it('renders a table with the base class', () => {
      const { container } = render(sampleTable());
      expect(container.querySelector('table')).toHaveClass('table');
    });

    it('renders body content when not loading', () => {
      render(sampleTable());
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('wraps in a responsive container when responsive', () => {
      const { container } = render(sampleTable({ responsive: true }));
      expect(container.querySelector('.table-responsive table')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Table.displayName).toBe('Table');
    });
  });

  describe('loading', () => {
    it('replaces body rows with skeleton rows', () => {
      render(sampleTable({ loading: true }));
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
      expect(document.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    });

    it('keeps the header while loading', () => {
      render(sampleTable({ loading: true }));
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('hides the footer while loading', () => {
      render(sampleTable({ loading: true }));
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
    });

    it('renders the requested number of skeleton rows', () => {
      const { container } = render(sampleTable({ loading: true, loadingRows: 5 }));
      // header row + 5 skeleton rows
      expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
    });

    it('defaults to 5 skeleton rows', () => {
      const { container } = render(sampleTable({ loading: true }));
      expect(container.querySelectorAll('tbody tr')).toHaveLength(5);
    });

    it('infers column count from the header', () => {
      const { container } = render(sampleTable({ loading: true }));
      // each skeleton row should have 3 cells (matching the 3 headers)
      const firstRow = container.querySelector('tbody tr');
      expect(firstRow?.querySelectorAll('td')).toHaveLength(3);
    });

    it('marks the loading body as busy', () => {
      const { container } = render(sampleTable({ loading: true }));
      expect(container.querySelector('tbody[aria-busy="true"]')).toBeInTheDocument();
    });

    it('honours an explicit loadingCols when there is no header', () => {
      const { container } = render(
        <Table loading loadingCols={4}>
          <tbody><tr><td>data</td></tr></tbody>
        </Table>
      );
      const firstRow = container.querySelector('tbody tr');
      expect(firstRow?.querySelectorAll('td')).toHaveLength(4);
    });

    it('respects colSpan when inferring column count', () => {
      const { container } = render(
        <Table loading>
          <thead>
            <tr><th colSpan={2}>Wide</th><th>Narrow</th></tr>
          </thead>
          <tbody><tr><td>a</td><td>b</td><td>c</td></tr></tbody>
        </Table>
      );
      const firstRow = container.querySelector('tbody tr');
      expect(firstRow?.querySelectorAll('td')).toHaveLength(3);
    });

    it('preserves caption and colgroup while loading', () => {
      const { container } = render(
        <Table loading>
          <caption>My table</caption>
          <colgroup><col /><col /></colgroup>
          <thead><tr><th>A</th><th>B</th></tr></thead>
          <tbody><tr><td>1</td><td>2</td></tr></tbody>
        </Table>
      );
      expect(container.querySelector('caption')).toBeInTheDocument();
      expect(container.querySelector('colgroup')).toBeInTheDocument();
      expect(screen.getByText('My table')).toBeInTheDocument();
    });
  });
});
