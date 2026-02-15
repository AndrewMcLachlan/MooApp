import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PageSize } from '../PageSize';

describe('PageSize', () => {
  describe('rendering', () => {
    it('renders select element', () => {
      render(<PageSize value={10} onChange={() => {}} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders label', () => {
      render(<PageSize value={10} onChange={() => {}} />);

      expect(screen.getByText('Page Size')).toBeInTheDocument();
    });

    it('renders with default page sizes', () => {
      render(<PageSize value={10} onChange={() => {}} />);

      expect(screen.getByRole('option', { name: '10' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '20' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '100' })).toBeInTheDocument();
    });

    it('renders with custom page sizes', () => {
      render(<PageSize value={25} pageSizes={[25, 50, 75]} onChange={() => {}} />);

      expect(screen.getByRole('option', { name: '25' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '75' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: '10' })).not.toBeInTheDocument();
    });

    it('selects current value', () => {
      render(<PageSize value={20} onChange={() => {}} />);

      expect(screen.getByRole('combobox')).toHaveValue('20');
    });
  });

  describe('id prop', () => {
    it('uses default id', () => {
      render(<PageSize value={10} onChange={() => {}} />);

      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'page-size');
    });

    it('uses custom id', () => {
      render(<PageSize id="custom-id" value={10} onChange={() => {}} />);

      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'custom-id');
    });

    it('label htmlFor matches id', () => {
      render(<PageSize id="my-select" value={10} onChange={() => {}} />);

      expect(screen.getByText('Page Size')).toHaveAttribute('for', 'my-select');
    });
  });

  describe('onChange callback', () => {
    it('calls onChange with selected value as number', () => {
      const onChange = vi.fn();
      render(<PageSize value={10} onChange={onChange} />);

      fireEvent.change(screen.getByRole('combobox'), { target: { value: '50' } });

      expect(onChange).toHaveBeenCalledWith(50);
    });

    it('passes numeric value, not string', () => {
      const onChange = vi.fn();
      render(<PageSize value={10} onChange={onChange} />);

      fireEvent.change(screen.getByRole('combobox'), { target: { value: '100' } });

      expect(onChange).toHaveBeenCalledWith(100);
      expect(typeof onChange.mock.calls[0][0]).toBe('number');
    });
  });

  describe('styling', () => {
    it('has page-size wrapper class', () => {
      const { container } = render(<PageSize value={10} onChange={() => {}} />);

      expect(container.querySelector('.page-size')).toBeInTheDocument();
    });

    it('has form-select class on select', () => {
      render(<PageSize value={10} onChange={() => {}} />);

      expect(screen.getByRole('combobox')).toHaveClass('form-select');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(PageSize.displayName).toBe('PageSize');
    });
  });
});
