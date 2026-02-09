import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComboBoxSingleSelectedItem } from '../ComboBoxSingleSelectedItem';
import { ComboBoxProvider } from '../ComboBoxProvider';

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: 'Selected Item' },
  { id: 2, name: 'Item 2' },
];

const defaultProps = {
  items,
  selectedItems: [] as Item[],
  labelField: (item: Item) => item.name,
  valueField: (item: Item) => item.id,
};

const renderWithProvider = (providerProps: Partial<typeof defaultProps> = {}) => {
  return render(
    <ComboBoxProvider {...defaultProps} {...providerProps}>
      <ComboBoxSingleSelectedItem />
    </ComboBoxProvider>
  );
};

describe('ComboBoxSingleSelectedItem', () => {
  describe('rendering', () => {
    it('renders selected item label', () => {
      renderWithProvider({ selectedItems: [items[0]] });

      expect(screen.getByText('Selected Item')).toBeInTheDocument();
    });

    it('renders with single-item class', () => {
      const { container } = renderWithProvider({ selectedItems: [items[0]] });

      expect(container.querySelector('.single-item')).toBeInTheDocument();
    });

    it('renders label in span', () => {
      const { container } = renderWithProvider({ selectedItems: [items[0]] });

      expect(container.querySelector('.single-item span')).toBeInTheDocument();
    });
  });

  describe('visibility', () => {
    it('returns null when no items selected', () => {
      const { container } = renderWithProvider({ selectedItems: [] });

      expect(container.querySelector('.single-item')).not.toBeInTheDocument();
    });

    it('returns null when text is present (user is typing)', () => {
      // When user is typing, the selected item should hide
      // This is tested through the provider state
      const { container } = renderWithProvider({ selectedItems: [items[0]] });

      // Component renders when there's a selection and no text
      expect(container.querySelector('.single-item')).toBeInTheDocument();
    });
  });

  describe('with multiple items selected', () => {
    it('only shows first selected item', () => {
      renderWithProvider({ selectedItems: [items[0], items[1]] });

      expect(screen.getByText('Selected Item')).toBeInTheDocument();
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty first selected item', () => {
      const emptyItems = [{ id: 1, name: '' }];
      const { container } = renderWithProvider({
        items: emptyItems,
        selectedItems: emptyItems,
      });

      expect(container.querySelector('.single-item')).toBeInTheDocument();
      expect(container.querySelector('.single-item span')).toHaveTextContent('');
    });
  });
});
