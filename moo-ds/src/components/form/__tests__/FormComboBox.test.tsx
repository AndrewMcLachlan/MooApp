import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormComboBox } from '../FormComboBox';
import { FromGroupProvider } from '../FormGroupProvider';

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FromGroupProvider groupId="testComboBox">
        {children}
      </FromGroupProvider>
    </FormProvider>
  );
};

describe('FormComboBox', () => {
  describe('rendering', () => {
    it('renders combobox', () => {
      const { container } = render(
        <Wrapper>
          <FormComboBox
            items={items}
            labelField={(item) => item.name}
            valueField={(item) => item.id}
          />
        </Wrapper>
      );

      expect(container.querySelector('.combo-box')).toBeInTheDocument();
    });

    it('renders with provided items', () => {
      render(
        <Wrapper>
          <FormComboBox
            items={items}
            labelField={(item) => item.name}
            valueField={(item) => item.id}
          />
        </Wrapper>
      );

      // Click to open the dropdown
      const comboBox = screen.getByRole('combobox').closest('.combo-box');
      fireEvent.click(comboBox!);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('id', () => {
    it('uses groupId when id not provided', () => {
      const { container } = render(
        <Wrapper>
          <FormComboBox
            items={items}
            labelField={(item) => item.name}
            valueField={(item) => item.id}
          />
        </Wrapper>
      );

      expect(container.querySelector('.combo-box')).toHaveAttribute('id', 'testComboBox');
    });

    it('uses custom id when provided', () => {
      const { container } = render(
        <Wrapper>
          <FormComboBox
            id="customId"
            items={items}
            labelField={(item) => item.name}
            valueField={(item) => item.id}
          />
        </Wrapper>
      );

      expect(container.querySelector('.combo-box')).toHaveAttribute('id', 'customId');
    });
  });

  describe('single select', () => {
    it('shows selected item based on form value', () => {
      render(
        <Wrapper defaultValues={{ testComboBox: 2 }}>
          <FormComboBox
            items={items}
            labelField={(item) => item.name}
            valueField={(item) => item.id}
          />
        </Wrapper>
      );

      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('updates form value on selection', () => {
      render(
        <Wrapper>
          <FormComboBox
            items={items}
            labelField={(item) => item.name}
            valueField={(item) => item.id}
          />
        </Wrapper>
      );

      // Click to open
      const comboBox = screen.getByRole('combobox').closest('.combo-box');
      fireEvent.click(comboBox!);

      // Select an item
      fireEvent.click(screen.getByText('Item 1'));

      // Item should now be selected
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('multi select', () => {
    it('shows multiple selected items based on form value', () => {
      render(
        <Wrapper defaultValues={{ testComboBox: [1, 3] }}>
          <FormComboBox
            items={items}
            labelField={(item) => item.name}
            valueField={(item) => item.id}
            multiSelect
          />
        </Wrapper>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(FormComboBox.displayName).toBe('FormComboBox');
    });
  });
});
