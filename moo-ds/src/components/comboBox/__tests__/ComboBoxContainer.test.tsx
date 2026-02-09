import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComboBoxContainer } from '../ComboBoxContainer';
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
  containerProps: Partial<React.ComponentProps<typeof ComboBoxContainer>> = {},
  providerProps: Partial<typeof defaultProps> = {}
) => {
  return render(
    <ComboBoxProvider {...defaultProps} {...providerProps}>
      <ComboBoxContainer placeholder="Select..." {...containerProps} />
    </ComboBoxProvider>
  );
};

describe('ComboBoxContainer', () => {
  describe('rendering', () => {
    it('renders combo-box container', () => {
      const { container } = renderWithProvider();

      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });

    it('renders input element', () => {
      renderWithProvider();

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      renderWithProvider({ placeholder: 'Select an option...' });

      expect(screen.getByPlaceholderText('Select an option...')).toBeInTheDocument();
    });

    it('renders with custom id', () => {
      const { container } = renderWithProvider({ id: 'my-combobox' });

      expect(container.querySelector('#my-combobox')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderWithProvider({ className: 'custom-combo' });

      expect(container.querySelector('.custom-combo')).toBeInTheDocument();
    });
  });

  describe('readonly mode', () => {
    it('applies readonly class when readonly', () => {
      const { container } = renderWithProvider({ readonly: true });

      expect(container.querySelector('.combo-box')).toHaveClass('readonly');
    });

    it('does not apply readonly class by default', () => {
      const { container } = renderWithProvider();

      expect(container.querySelector('.combo-box')).not.toHaveClass('readonly');
    });
  });

  describe('hidden prop', () => {
    it('hides container when hidden is true', () => {
      const { container } = renderWithProvider({ hidden: true });

      expect(container.querySelector('.combo-box')).toHaveAttribute('hidden');
    });
  });

  describe('interaction', () => {
    it('toggles dropdown on click', () => {
      const { container } = renderWithProvider();

      const combobox = container.querySelector('.combo-box')!;
      fireEvent.click(combobox);

      // Dropdown should be shown
      expect(container.querySelector('.cb-list')).toBeInTheDocument();
    });

    it('closes dropdown on Escape key', () => {
      const { container } = renderWithProvider();

      const combobox = container.querySelector('.combo-box')!;
      fireEvent.click(combobox);

      expect(container.querySelector('.cb-list')).toBeInTheDocument();

      fireEvent.keyUp(combobox, { key: 'Escape' });

      expect(container.querySelector('.cb-list')).not.toBeInTheDocument();
    });
  });

  describe('multi-select mode', () => {
    it('renders selected items in multi-select mode', () => {
      renderWithProvider({}, { selectedItems: [items[0]], multiSelect: true });

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('single-select mode', () => {
    it('renders selected item in single-select mode', () => {
      renderWithProvider({}, { selectedItems: [items[0]] });

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('tabIndex', () => {
    it('passes tabIndex to input', () => {
      renderWithProvider({ tabIndex: 5 });

      expect(screen.getByRole('combobox')).toHaveAttribute('tabindex', '5');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ComboBoxContainer.displayName).toBe('ComboBoxContainer');
    });
  });
});
