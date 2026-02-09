import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ComboBoxProvider, useComboBox } from '../ComboBoxProvider';

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

// Test component to access context
const ContextConsumer = () => {
  const context = useComboBox();
  return (
    <div>
      <span data-testid="selected-count">{context?.selectedItems?.length ?? 0}</span>
      <span data-testid="items-count">{context?.items?.length ?? 0}</span>
      <span data-testid="text">{context?.text ?? ''}</span>
      <span data-testid="show">{context?.show ? 'true' : 'false'}</span>
      <button onClick={() => context?.setShow(true)}>Open</button>
      <button onClick={() => context?.setText('test')}>Set Text</button>
      <button onClick={() => context?.setSelectedItems([items[0]])}>Select First</button>
      <button onClick={(e) => context?.clear(e as any)}>Clear</button>
    </div>
  );
};

describe('ComboBoxProvider', () => {
  describe('context provision', () => {
    it('provides context to children', () => {
      render(
        <ComboBoxProvider {...defaultProps}>
          <ContextConsumer />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('items-count')).toHaveTextContent('3');
    });

    it('provides selected items', () => {
      render(
        <ComboBoxProvider {...defaultProps} selectedItems={[items[0], items[1]]}>
          <ContextConsumer />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
    });
  });

  describe('state management', () => {
    it('manages show state', async () => {
      render(
        <ComboBoxProvider {...defaultProps}>
          <ContextConsumer />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('show')).toHaveTextContent('false');

      await act(async () => {
        fireEvent.click(screen.getByText('Open'));
      });

      expect(screen.getByTestId('show')).toHaveTextContent('true');
    });

    it('manages text state', async () => {
      render(
        <ComboBoxProvider {...defaultProps}>
          <ContextConsumer />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('text')).toHaveTextContent('');

      await act(async () => {
        fireEvent.click(screen.getByText('Set Text'));
      });

      expect(screen.getByTestId('text')).toHaveTextContent('test');
    });

    it('manages selected items', async () => {
      render(
        <ComboBoxProvider {...defaultProps}>
          <ContextConsumer />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('selected-count')).toHaveTextContent('0');

      await act(async () => {
        fireEvent.click(screen.getByText('Select First'));
      });

      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    });
  });

  describe('clear functionality', () => {
    it('clears selected items', async () => {
      const onChange = vi.fn();
      render(
        <ComboBoxProvider {...defaultProps} selectedItems={[items[0]]} onChange={onChange}>
          <ContextConsumer />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');

      await act(async () => {
        fireEvent.click(screen.getByText('Clear'));
      });

      expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('props', () => {
    it('exposes clearable prop', () => {
      const ClearableCheck = () => {
        const { clearable } = useComboBox() ?? {};
        return <span data-testid="clearable">{clearable ? 'yes' : 'no'}</span>;
      };

      render(
        <ComboBoxProvider {...defaultProps} clearable>
          <ClearableCheck />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('clearable')).toHaveTextContent('yes');
    });

    it('exposes creatable prop', () => {
      const CreatableCheck = () => {
        const { creatable } = useComboBox() ?? {};
        return <span data-testid="creatable">{creatable ? 'yes' : 'no'}</span>;
      };

      render(
        <ComboBoxProvider {...defaultProps} creatable>
          <CreatableCheck />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('creatable')).toHaveTextContent('yes');
    });

    it('exposes multiSelect prop', () => {
      const MultiSelectCheck = () => {
        const { multiSelect } = useComboBox() ?? {};
        return <span data-testid="multiSelect">{multiSelect ? 'yes' : 'no'}</span>;
      };

      render(
        <ComboBoxProvider {...defaultProps} multiSelect>
          <MultiSelectCheck />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('multiSelect')).toHaveTextContent('yes');
    });

    it('exposes readonly prop', () => {
      const ReadonlyCheck = () => {
        const { readonly } = useComboBox() ?? {};
        return <span data-testid="readonly">{readonly ? 'yes' : 'no'}</span>;
      };

      render(
        <ComboBoxProvider {...defaultProps} readonly>
          <ReadonlyCheck />
        </ComboBoxProvider>
      );

      expect(screen.getByTestId('readonly')).toHaveTextContent('yes');
    });
  });

  describe('multi-select item filtering', () => {
    it('filters out selected items from available items in multi-select', () => {
      const ItemsCheck = () => {
        const { items } = useComboBox() ?? { items: [] };
        return <span data-testid="available">{items.length}</span>;
      };

      render(
        <ComboBoxProvider {...defaultProps} multiSelect selectedItems={[items[0]]}>
          <ItemsCheck />
        </ComboBoxProvider>
      );

      // Should have 2 available items (3 total - 1 selected)
      expect(screen.getByTestId('available')).toHaveTextContent('2');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ComboBoxProvider.displayName).toBe('ComboBoxProvider');
    });
  });
});
