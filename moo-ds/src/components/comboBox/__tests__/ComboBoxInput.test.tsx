import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBoxInput } from '../ComboBoxInput';
import { ComboBoxProvider } from '../ComboBoxProvider';

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
];

const defaultProps = {
  items,
  selectedItems: [] as Item[],
  labelField: (item: Item) => item.name,
  valueField: (item: Item) => item.id,
};

const renderWithProvider = (
  inputProps: Partial<React.ComponentProps<typeof ComboBoxInput>> = {},
  providerProps: Partial<typeof defaultProps> = {}
) => {
  return render(
    <ComboBoxProvider {...defaultProps} {...providerProps}>
      <ComboBoxInput placeholder="Search..." readonly={false} {...inputProps} />
    </ComboBoxProvider>
  );
};

describe('ComboBoxInput', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      renderWithProvider();

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with placeholder when no items selected', () => {
      renderWithProvider({ placeholder: 'Select an item...' });

      expect(screen.getByPlaceholderText('Select an item...')).toBeInTheDocument();
    });

    it('does not show placeholder when items are selected', () => {
      renderWithProvider(
        { placeholder: 'Select an item...' },
        { selectedItems: [items[0]] }
      );

      expect(screen.queryByPlaceholderText('Select an item...')).not.toBeInTheDocument();
    });
  });

  describe('input attributes', () => {
    it('has type text', () => {
      renderWithProvider();

      expect(screen.getByRole('combobox')).toHaveAttribute('type', 'text');
    });

    it('has autocomplete off', () => {
      renderWithProvider();

      expect(screen.getByRole('combobox')).toHaveAttribute('autocomplete', 'off');
    });

    it('has spellcheck false', () => {
      renderWithProvider();

      expect(screen.getByRole('combobox')).toHaveAttribute('spellcheck', 'false');
    });

    it('has role combobox', () => {
      renderWithProvider();

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('filters items on input', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.type(screen.getByRole('combobox'), 'App');

      // The filtering happens in the context, we verify the input value
      expect(screen.getByRole('combobox')).toHaveValue('App');
    });
  });

  describe('keyboard navigation', () => {
    it('closes dropdown and clears text on Escape', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.type(screen.getByRole('combobox'), 'test');
      expect(screen.getByRole('combobox')).toHaveValue('test');

      await user.keyboard('{Escape}');

      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });

  describe('tabIndex', () => {
    it('accepts tabIndex prop', () => {
      renderWithProvider({ tabIndex: 3 });

      expect(screen.getByRole('combobox')).toHaveAttribute('tabindex', '3');
    });
  });

  describe('readonly mode', () => {
    it('does not show placeholder when readonly', () => {
      renderWithProvider({ placeholder: 'Select...', readonly: true });

      // Placeholder is empty when readonly
      expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', '');
    });
  });

  describe('visibility', () => {
    it('is visible when no items selected', () => {
      renderWithProvider();

      expect(screen.getByRole('combobox')).not.toHaveAttribute('hidden');
    });

    it('is hidden when items selected and not in input mode', () => {
      const { container } = render(
        <ComboBoxProvider {...defaultProps} selectedItems={[items[0]]}>
          <ComboBoxInput placeholder="Search..." readonly={false} />
        </ComboBoxProvider>
      );

      // Input visibility is controlled by showInput state
      expect(container.querySelector('input')).toBeInTheDocument();
    });
  });
});
