import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBox } from '../SearchBox';

describe('SearchBox', () => {
  describe('rendering', () => {
    it('renders search input', () => {
      render(<SearchBox value="" />);

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<SearchBox value="" />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<SearchBox value="test query" />);

      expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
    });

    it('has correct classes', () => {
      render(<SearchBox value="" />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('form-control');
      expect(input).toHaveClass('search-box');
    });

    it('has type search', () => {
      render(<SearchBox value="" />);

      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
    });
  });

  describe('onChange', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SearchBox value="" onChange={onChange} />);

      await user.type(screen.getByRole('searchbox'), 'a');

      expect(onChange).toHaveBeenCalledWith('a');
    });

    it('passes updated value to onChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SearchBox value="" onChange={onChange} />);

      await user.type(screen.getByRole('searchbox'), 'test');

      expect(onChange).toHaveBeenCalledTimes(4);
      expect(onChange).toHaveBeenLastCalledWith('t');
    });

    it('does not throw when onChange is not provided', () => {
      render(<SearchBox value="" />);

      expect(() => {
        fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });
      }).not.toThrow();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(SearchBox.displayName).toBe('SearchBox');
    });
  });
});
