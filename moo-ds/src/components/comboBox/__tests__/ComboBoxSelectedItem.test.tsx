import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComboBoxSelectedItem } from '../ComboBoxSelectedItem';
import { ComboBoxProvider } from '../ComboBoxProvider';

interface Item {
  id: number;
  name: string;
  color?: string;
}

const items: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2', color: '#ff0000' },
];

const defaultProps = {
  items,
  selectedItems: [items[0]],
  labelField: (item: Item) => item.name,
  valueField: (item: Item) => item.id,
};

const renderWithProvider = (
  itemProps: { item: Item },
  providerProps: Partial<typeof defaultProps> = {}
) => {
  return render(
    <ComboBoxProvider {...defaultProps} {...providerProps}>
      <ComboBoxSelectedItem {...itemProps} />
    </ComboBoxProvider>
  );
};

describe('ComboBoxSelectedItem', () => {
  describe('rendering', () => {
    it('renders item wrapper', () => {
      const { container } = renderWithProvider({ item: items[0] });

      expect(container.querySelector('.item')).toBeInTheDocument();
    });

    it('renders item label', () => {
      renderWithProvider({ item: items[0] });

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders as CloseBadge', () => {
      const { container } = renderWithProvider({ item: items[0] });

      expect(container.querySelector('.close-badge')).toBeInTheDocument();
    });

    it('renders close icon', () => {
      const { container } = renderWithProvider({ item: items[0] });

      expect(container.querySelector('svg[data-icon="circle-xmark"]')).toBeInTheDocument();
    });

    it('returns null for undefined item', () => {
      const { container } = renderWithProvider({ item: undefined as any });

      expect(container.querySelector('.item')).not.toBeInTheDocument();
    });
  });

  describe('color styling', () => {
    it('uses primary background by default', () => {
      const { container } = renderWithProvider({ item: items[0] });

      expect(container.querySelector('.badge')).toHaveClass('bg-primary');
    });

    it('uses custom color when colourField is provided', () => {
      const { container } = renderWithProvider(
        { item: items[1] },
        { colourField: (item) => item.color }
      );

      const badge = container.querySelector('.badge');
      expect(badge).toHaveStyle({ backgroundColor: '#ff0000' });
    });
  });

  describe('removal', () => {
    it('calls onRemove when close is clicked', () => {
      const onRemove = vi.fn();
      const { container } = renderWithProvider(
        { item: items[0] },
        { onRemove }
      );

      fireEvent.click(container.querySelector('svg[data-icon="circle-xmark"]')!);

      expect(onRemove).toHaveBeenCalledWith(items[0]);
    });

    it('calls onChange with updated items when removed', () => {
      const onChange = vi.fn();
      const { container } = renderWithProvider(
        { item: items[0] },
        { onChange, selectedItems: [items[0], items[1]] }
      );

      fireEvent.click(container.querySelector('svg[data-icon="circle-xmark"]')!);

      expect(onChange).toHaveBeenCalledWith([items[1]]);
    });
  });

  describe('pill styling', () => {
    it('renders as pill badge', () => {
      const { container } = renderWithProvider({ item: items[0] });

      expect(container.querySelector('.badge')).toHaveClass('rounded-pill');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ComboBoxSelectedItem.displayName).toBe('ComboBoxSelectedItem');
    });
  });
});
