import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComobBoxItem } from '../ComboBoxItem';
import { ComboBoxProvider } from '../ComboBoxProvider';

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

const renderWithProvider = (
  itemProps: React.ComponentProps<typeof ComobBoxItem<Item>>
) => {
  return render(
    <ComboBoxProvider {...defaultProps}>
      <ol>
        <ComobBoxItem {...itemProps} />
      </ol>
    </ComboBoxProvider>
  );
};

describe('ComboBoxItem', () => {
  describe('rendering', () => {
    it('renders list item', () => {
      const onSelected = vi.fn();
      renderWithProvider({ item: items[0], onSelected });

      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('renders item label from labelField', () => {
      const onSelected = vi.fn();
      renderWithProvider({ item: items[0], onSelected });

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders custom label when provided', () => {
      const onSelected = vi.fn();
      renderWithProvider({ item: items[0], onSelected, label: 'Custom Label' });

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('returns null for undefined item', () => {
      const onSelected = vi.fn();
      const { container } = renderWithProvider({ item: undefined as any, onSelected });

      expect(container.querySelector('li')).not.toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onSelected when clicked', () => {
      const onSelected = vi.fn();
      renderWithProvider({ item: items[0], onSelected });

      fireEvent.click(screen.getByText('Item 1'));

      expect(onSelected).toHaveBeenCalledTimes(1);
      expect(onSelected).toHaveBeenCalledWith(items[0]);
    });

    it('stops event propagation on click', () => {
      const onSelected = vi.fn();
      const parentClick = vi.fn();

      render(
        <ComboBoxProvider {...defaultProps}>
          <ol onClick={parentClick}>
            <ComobBoxItem item={items[0]} onSelected={onSelected} />
          </ol>
        </ComboBoxProvider>
      );

      fireEvent.click(screen.getByText('Item 1'));

      expect(onSelected).toHaveBeenCalled();
      expect(parentClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has tabIndex', () => {
      const onSelected = vi.fn();
      renderWithProvider({ item: items[0], onSelected });

      expect(screen.getByRole('listitem')).toHaveAttribute('tabindex', '2');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ComobBoxItem.displayName).toBe('ComboBoxItem');
    });
  });
});
