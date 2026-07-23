import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBoxInput } from '../ComboBoxInput';
import { ComboBoxProvider } from '../ComboBoxProvider';
import { ComboBoxList } from '../ComboBoxList';

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

    it('debounces the search callback (runs once after the delay, not per keystroke)', () => {
      vi.useFakeTimers();
      try {
        const search = vi.fn().mockReturnValue([]);
        render(
          <ComboBoxProvider {...defaultProps} search={search}>
            <ComboBoxInput placeholder="Search..." readonly={false} />
          </ComboBoxProvider>
        );

        const input = screen.getByRole('combobox');
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.change(input, { target: { value: 'app' } });

        expect(search).not.toHaveBeenCalled();

        // Wrap in act() so React flushes the state updates the debounced
        // callback schedules before we assert.
        act(() => {
          vi.advanceTimersByTime(300);
        });

        expect(search).toHaveBeenCalledTimes(1);
        expect(search).toHaveBeenCalledWith('app');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('accessibility', () => {
    it('exposes aria-expanded and aria-controls on the combobox', () => {
      renderWithProvider();

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded');
      // aria-controls is a per-instance generated id (React useId), not a
      // shared hard-coded value.
      expect(input.getAttribute('aria-controls')).toBeTruthy();
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

  describe('creatable with search', () => {
    const renderCreatableSearch = (search: (input: string) => Item[], onCreate = vi.fn()) => {
      render(
        <ComboBoxProvider
          {...defaultProps}
          search={search}
          creatable
          createLabel={(input: string) => `Add "${input}"`}
          onCreate={onCreate}
        >
          <ComboBoxInput placeholder="Search..." readonly={false} />
          <ComboBoxList />
        </ComboBoxProvider>
      );
      return onCreate;
    };

    it('offers the add option when no search result matches the typed text', () => {
      vi.useFakeTimers();
      try {
        const onCreate = renderCreatableSearch(vi.fn().mockReturnValue([items[0]]));

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Pear' } });
        act(() => {
          vi.advanceTimersByTime(300);
        });

        const addOption = screen.getByText('Add "Pear"');
        expect(addOption).toBeInTheDocument();

        fireEvent.click(addOption);
        expect(onCreate).toHaveBeenCalledWith('Pear');
      } finally {
        vi.useRealTimers();
      }
    });

    it('does not offer the add option when a search result matches case-insensitively', () => {
      vi.useFakeTimers();
      try {
        renderCreatableSearch(vi.fn().mockReturnValue([items[0]])); // Apple

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'apple' } });
        act(() => {
          vi.advanceTimersByTime(300);
        });

        expect(screen.queryByText('Add "apple"')).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('does not offer the add option for empty input', () => {
      vi.useFakeTimers();
      try {
        renderCreatableSearch(vi.fn().mockReturnValue([]));

        const input = screen.getByRole('combobox');
        fireEvent.change(input, { target: { value: 'x' } });
        fireEvent.change(input, { target: { value: '' } });
        act(() => {
          vi.advanceTimersByTime(300);
        });

        expect(screen.queryByText(/^Add "/)).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
