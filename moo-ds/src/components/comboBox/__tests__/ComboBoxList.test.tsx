import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComboBoxProvider, ComboBoxProps } from '../ComboBoxProvider';
import { ComboBoxContainer } from '../ComboBoxContainer';

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

const defaultProps = {
  items,
  selectedItems: [] as Item[],
  labelField: (item: Item) => item.name,
  valueField: (item: Item) => item.id,
};

// Helper to render with container (which manages show state)
const renderWithContainer = (providerProps: Partial<ComboBoxProps<Item>> = {}) => {
  return render(
    <ComboBoxProvider {...defaultProps} {...providerProps}>
      <ComboBoxContainer placeholder="Select..." />
    </ComboBoxProvider>
  );
};

describe('ComboBoxList', () => {
  describe('visibility', () => {
    it('does not render when closed', () => {
      const { container } = renderWithContainer();

      // List should not be visible until clicked
      expect(container.querySelector('.cb-list')).not.toBeInTheDocument();
    });

    it('renders when opened', () => {
      const { container } = renderWithContainer();

      // Click to open
      fireEvent.click(container.querySelector('.combo-box')!);

      expect(container.querySelector('.cb-list')).toBeInTheDocument();
    });
  });

  describe('rendering items', () => {
    it('renders all items', () => {
      const { container } = renderWithContainer();

      fireEvent.click(container.querySelector('.combo-box')!);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders as ordered list', () => {
      const { container } = renderWithContainer();

      fireEvent.click(container.querySelector('.combo-box')!);

      expect(container.querySelector('ol.cb-list')).toBeInTheDocument();
    });
  });

  describe('no results', () => {
    it('shows no results message when items empty and not creatable', () => {
      const { container } = renderWithContainer({ items: [] });

      fireEvent.click(container.querySelector('.combo-box')!);

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('has no-results class on empty message', () => {
      const { container } = renderWithContainer({ items: [] });

      fireEvent.click(container.querySelector('.combo-box')!);

      expect(container.querySelector('.no-results')).toBeInTheDocument();
    });
  });

  describe('item selection', () => {
    it('calls onChange when item is selected', () => {
      const onChange = vi.fn();
      const { container } = renderWithContainer({ onChange });

      fireEvent.click(container.querySelector('.combo-box')!);
      fireEvent.click(screen.getByText('Item 1'));

      expect(onChange).toHaveBeenCalledWith([items[0]]);
    });

    it('closes dropdown after selection', () => {
      const { container } = renderWithContainer();

      fireEvent.click(container.querySelector('.combo-box')!);
      expect(container.querySelector('.cb-list')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Item 1'));
      expect(container.querySelector('.cb-list')).not.toBeInTheDocument();
    });

    it('calls onAdd in multi-select mode', () => {
      const onAdd = vi.fn();
      const { container } = renderWithContainer({ onAdd, multiSelect: true });

      fireEvent.click(container.querySelector('.combo-box')!);
      fireEvent.click(screen.getByText('Item 1'));

      expect(onAdd).toHaveBeenCalledWith(items[0]);
    });
  });

  describe('creatable', () => {
    it('shows create option when creatable and new item exists', () => {
      const onCreate = vi.fn();
      const { container } = renderWithContainer({
        creatable: true,
        onCreate,
        createLabel: (text: string) => `Create "${text}"`,
      });

      fireEvent.click(container.querySelector('.combo-box')!);

      // Type something new to trigger create option
      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'New Item' } });

      // Create option should appear
      expect(screen.getByText('Create "New Item"')).toBeInTheDocument();
    });

    it('calls onCreate when create option is selected', () => {
      const onCreate = vi.fn();
      const { container } = renderWithContainer({
        creatable: true,
        onCreate,
        createLabel: (text: string) => `Create "${text}"`,
      });

      fireEvent.click(container.querySelector('.combo-box')!);

      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'New Item' } });

      fireEvent.click(screen.getByText('Create "New Item"'));

      expect(onCreate).toHaveBeenCalledWith('New Item');
    });
  });
});
