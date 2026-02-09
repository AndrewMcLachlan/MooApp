import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test-utils';
import { SectionTable } from '../SectionTable';

describe('SectionTable', () => {
  describe('rendering without header', () => {
    it('renders table directly when no header', () => {
      const { container } = render(
        <SectionTable>
          <thead><tr><th>Column</th></tr></thead>
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('applies section class to table when no header', () => {
      const { container } = render(
        <SectionTable>
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(container.querySelector('table')).toHaveClass('section');
    });

    it('applies custom className to table', () => {
      const { container } = render(
        <SectionTable className="custom-table">
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(container.querySelector('table')).toHaveClass('custom-table');
    });
  });

  describe('rendering with header', () => {
    it('renders Section wrapper when header is provided', () => {
      const { container } = render(
        <SectionTable header="Table Title">
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(container.querySelector('.section-table')).toBeInTheDocument();
    });

    it('renders header text', () => {
      render(
        <SectionTable header="Table Title">
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(screen.getByText('Table Title')).toBeInTheDocument();
    });

    it('renders table inside Section', () => {
      const { container } = render(
        <SectionTable header="Title">
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(container.querySelector('.section-table table')).toBeInTheDocument();
    });
  });

  describe('headerSize prop', () => {
    it('applies headerSize to Section header', () => {
      const { container } = render(
        <SectionTable header="Title" headerSize={3}>
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(container.querySelector('h3')).toBeInTheDocument();
    });
  });

  describe('table content', () => {
    it('renders table rows and cells', () => {
      render(
        <SectionTable>
          <thead>
            <tr><th>Header 1</th><th>Header 2</th></tr>
          </thead>
          <tbody>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
          </tbody>
        </SectionTable>
      );

      expect(screen.getByText('Header 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 1')).toBeInTheDocument();
    });
  });

  describe('Bootstrap Table props', () => {
    it('passes through Table props', () => {
      const { container } = render(
        <SectionTable striped hover>
          <tbody><tr><td>Data</td></tr></tbody>
        </SectionTable>
      );

      expect(container.querySelector('table')).toHaveClass('table-striped');
      expect(container.querySelector('table')).toHaveClass('table-hover');
    });
  });
});
