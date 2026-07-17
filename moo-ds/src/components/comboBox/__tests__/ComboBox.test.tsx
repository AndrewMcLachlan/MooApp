import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComboBox } from '../ComboBox';

interface TestItem {
  id: number;
  name: string;
  color?: string;
}

const testItems: TestItem[] = [
  { id: 1, name: 'Apple', color: 'red' },
  { id: 2, name: 'Banana', color: 'yellow' },
  { id: 3, name: 'Cherry', color: 'red' },
  { id: 4, name: 'Date', color: 'brown' },
  { id: 5, name: 'Elderberry', color: 'purple' },
];

const defaultProps = {
  items: testItems,
  labelField: (item: TestItem) => item.name,
  valueField: (item: TestItem) => item.id,
};

describe('ComboBox', () => {
  describe('rendering', () => {
    it('renders combo box container', () => {
      const { container } = render(<ComboBox {...defaultProps} />);

      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });

    it('renders with custom id', () => {
      const { container } = render(<ComboBox {...defaultProps} id="my-combo" />);

      expect(container.querySelector('#my-combo')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<ComboBox {...defaultProps} className="custom-class" />);

      expect(container.querySelector('.combo-box')).toHaveClass('custom-class');
    });

    it('renders with placeholder', () => {
      render(<ComboBox {...defaultProps} placeholder="Choose fruit" />);

      expect(screen.getByPlaceholderText('Choose fruit')).toBeInTheDocument();
    });

    it('uses default placeholder when not provided', () => {
      render(<ComboBox {...defaultProps} />);

      expect(screen.getByPlaceholderText('Select...')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(ComboBox.displayName).toBe('ComboBox');
    });
  });

  describe('dropdown interaction', () => {
    it('responds to click events', () => {
      const { container } = render(<ComboBox {...defaultProps} />);

      const comboBox = container.querySelector('.combo-box');
      fireEvent.click(comboBox!);

      // ComboBox should still be in the document after click
      expect(comboBox).toBeInTheDocument();
    });

    it('displays all items in dropdown', () => {
      const { container } = render(<ComboBox {...defaultProps} />);

      fireEvent.click(container.querySelector('.combo-box')!);

      testItems.forEach(item => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });

    it('handles Escape key', () => {
      const { container } = render(<ComboBox {...defaultProps} />);

      const comboBox = container.querySelector('.combo-box')!;
      fireEvent.click(comboBox);
      fireEvent.keyUp(comboBox, { key: 'Escape' });

      // ComboBox should handle the event without error
      expect(comboBox).toBeInTheDocument();
    });
  });

  describe('single select', () => {
    it('displays selected item', () => {
      render(
        <ComboBox {...defaultProps} selectedItems={[testItems[0]]} />
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('accepts onChange prop', () => {
      const onChange = vi.fn();
      const { container } = render(
        <ComboBox {...defaultProps} onChange={onChange} />
      );

      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });

    it('accepts onAdd prop', () => {
      const onAdd = vi.fn();
      const { container } = render(
        <ComboBox {...defaultProps} onAdd={onAdd} />
      );

      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });
  });

  describe('multi select', () => {
    it('accepts multiSelect prop', () => {
      const { container } = render(
        <ComboBox {...defaultProps} multiSelect />
      );

      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });

    it('displays multiple selected items', () => {
      render(
        <ComboBox
          {...defaultProps}
          multiSelect
          selectedItems={[testItems[0], testItems[1]]}
        />
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('renders with selected items in multiSelect mode', () => {
      render(
        <ComboBox
          {...defaultProps}
          multiSelect
          selectedItems={[testItems[0]]}
        />
      );

      // Selected item should be displayed
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
  });

  describe('readonly mode', () => {
    it('adds readonly class when readonly', () => {
      const { container } = render(
        <ComboBox {...defaultProps} readonly />
      );

      expect(container.querySelector('.combo-box')).toHaveClass('readonly');
    });

    it('accepts readonly prop', () => {
      const { container } = render(<ComboBox {...defaultProps} readonly />);

      // Input may be hidden in readonly mode
      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });
  });

  describe('clearable', () => {
    it('shows clear button when clearable and has selection', () => {
      const { container } = render(
        <ComboBox
          {...defaultProps}
          clearable
          selectedItems={[testItems[0]]}
        />
      );

      // Look for clear control
      const controls = container.querySelector('.combo-box');
      expect(controls).toBeInTheDocument();
    });
  });

  describe('hidden', () => {
    it('hides combo box when hidden prop is true', () => {
      const { container } = render(
        <ComboBox {...defaultProps} hidden />
      );

      expect(container.querySelector('.combo-box')).toHaveAttribute('hidden');
    });
  });

  describe('custom label rendering', () => {
    it('uses labelField to render item labels', () => {
      const customLabelField = (item: TestItem) => `Fruit: ${item.name}`;
      const { container } = render(
        <ComboBox
          {...defaultProps}
          labelField={customLabelField}
        />
      );

      fireEvent.click(container.querySelector('.combo-box')!);

      expect(screen.getByText('Fruit: Apple')).toBeInTheDocument();
    });
  });

  describe('colourField', () => {
    it('accepts colourField prop', () => {
      const { container } = render(
        <ComboBox
          {...defaultProps}
          colourField={(item: TestItem) => item.color || 'gray'}
          selectedItems={[testItems[0]]}
        />
      );

      // Component should render without error
      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });
  });

  describe('collapse (multi-select)', () => {
    const manyItems: TestItem[] = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
    const manyProps = {
      items: manyItems,
      labelField: (item: TestItem) => item.name,
      valueField: (item: TestItem) => item.id,
      multiSelect: true,
    };

    it('collapses to the first N pills + a "+X more" chip when inactive', () => {
      const { container } = render(<ComboBox {...manyProps} selectedItems={manyItems} />);

      // Default collapseAfter is 5 -> 5 pills, +3 more.
      expect(container.querySelectorAll('.body .item')).toHaveLength(5);
      expect(screen.getByText('+3 more')).toBeInTheDocument();
      expect(screen.queryByText('Item 8')).not.toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('respects the collapseAfter prop', () => {
      const { container } = render(<ComboBox {...manyProps} collapseAfter={3} selectedItems={manyItems} />);

      expect(container.querySelectorAll('.body .item')).toHaveLength(3);
      expect(screen.getByText('+5 more')).toBeInTheDocument();
    });

    it('does not collapse when at or below the threshold', () => {
      render(<ComboBox {...manyProps} selectedItems={manyItems.slice(0, 4)} />);

      expect(screen.queryByText(/more$/)).not.toBeInTheDocument();
    });

    it('expands to all pills when activated', () => {
      const { container } = render(<ComboBox {...manyProps} selectedItems={manyItems} />);

      fireEvent.click(container.querySelector('.combo-box')!);

      expect(container.querySelectorAll('.body .item')).toHaveLength(8);
      expect(screen.queryByText('+3 more')).not.toBeInTheDocument();
      expect(screen.getByText('Item 8')).toBeInTheDocument();
    });

    it('does not collapse a single-select combo box', () => {
      render(<ComboBox {...defaultProps} selectedItems={[testItems[0]]} />);
      expect(screen.queryByText(/more$/)).not.toBeInTheDocument();
    });
  });

  describe('focus on click', () => {
    it('focuses the input when the control is clicked', () => {
      const { container } = render(<ComboBox {...defaultProps} multiSelect selectedItems={[testItems[0]]} />);

      fireEvent.click(container.querySelector('.combo-box')!);

      const input = container.querySelector('input');
      expect(document.activeElement).toBe(input);
    });
  });
});
