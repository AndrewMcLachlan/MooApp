import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ComboBoxControls } from '../ComboBoxControls';
import { ComboBoxProvider, ComboBoxProps } from '../ComboBoxProvider';

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

const defaultProps = {
  items,
  selectedItems: [] as Item[],
  labelField: (item: Item) => item.name,
  valueField: (item: Item) => item.id,
};

const renderWithProvider = (providerProps: Partial<ComboBoxProps<Item>> = {}) => {
  return render(
    <ComboBoxProvider {...defaultProps} {...providerProps}>
      <ComboBoxControls />
    </ComboBoxProvider>
  );
};

describe('ComboBoxControls', () => {
  describe('rendering', () => {
    it('renders controls container', () => {
      const { container } = renderWithProvider();

      expect(container.querySelector('.controls')).toBeInTheDocument();
    });

    it('renders dropdown chevron', () => {
      const { container } = renderWithProvider();

      expect(container.querySelector('.drop-down-chevron')).toBeInTheDocument();
    });
  });

  describe('clear button', () => {
    it('does not show clear button when clearable is false', () => {
      const { container } = renderWithProvider({
        selectedItems: [items[0]],
        clearable: false,
      });

      expect(container.querySelector('.clear-input')).not.toBeInTheDocument();
    });

    it('does not show clear button when no items selected', () => {
      const { container } = renderWithProvider({
        clearable: true,
        selectedItems: [],
      });

      expect(container.querySelector('.clear-input')).not.toBeInTheDocument();
    });

    it('shows clear button when clearable and items selected', () => {
      const { container } = renderWithProvider({
        clearable: true,
        selectedItems: [items[0]],
      });

      expect(container.querySelector('.clear-input')).toBeInTheDocument();
    });

    it('applies clearable class when clear button is shown', () => {
      const { container } = renderWithProvider({
        clearable: true,
        selectedItems: [items[0]],
      });

      expect(container.querySelector('.controls')).toHaveClass('clearable');
    });

    it('clears selection when clear button is clicked', () => {
      const onChange = vi.fn();
      const { container } = renderWithProvider({
        clearable: true,
        selectedItems: [items[0]],
        onChange,
      });

      const clearButton = container.querySelector('.clear-input')!;
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('accessibility', () => {
    it('clear button has aria-hidden', () => {
      const { container } = renderWithProvider({
        clearable: true,
        selectedItems: [items[0]],
      });

      expect(container.querySelector('.clear-input')).toHaveAttribute('aria-hidden', 'true');
    });

    it('clear button has focusable false', () => {
      const { container } = renderWithProvider({
        clearable: true,
        selectedItems: [items[0]],
      });

      expect(container.querySelector('.clear-input')).toHaveAttribute('focusable', 'false');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ComboBoxControls.displayName).toBe('ComboBoxControls');
    });
  });
});
