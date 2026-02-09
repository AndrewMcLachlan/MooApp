import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Select } from '../Select';
import { FromGroupProvider } from '../FormGroupProvider';

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FromGroupProvider groupId="testSelect">
        {children}
      </FromGroupProvider>
    </FormProvider>
  );
};

describe('Select', () => {
  describe('rendering', () => {
    it('renders select element', () => {
      render(
        <Wrapper>
          <Select>
            <option value="1">Option 1</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('applies form-select class', () => {
      render(
        <Wrapper>
          <Select>
            <option value="1">Option 1</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getByRole('combobox')).toHaveClass('form-select');
    });

    it('renders options', () => {
      render(
        <Wrapper>
          <Select>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getAllByRole('option')).toHaveLength(3);
    });
  });

  describe('id', () => {
    it('uses groupId as id', () => {
      render(
        <Wrapper>
          <Select>
            <option value="1">Option 1</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'testSelect');
    });

    it('uses custom id when provided', () => {
      render(
        <Wrapper>
          <Select id="customId">
            <option value="1">Option 1</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'customId');
    });
  });

  describe('value handling', () => {
    it('displays default value', () => {
      render(
        <Wrapper defaultValues={{ testSelect: '2' }}>
          <Select>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getByRole('combobox')).toHaveValue('2');
    });

    it('updates value on change', () => {
      render(
        <Wrapper>
          <Select>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </Select>
        </Wrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '2' } });

      expect(select).toHaveValue('2');
    });
  });

  describe('props', () => {
    it('accepts disabled prop', () => {
      render(
        <Wrapper>
          <Select disabled>
            <option value="1">Option 1</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('accepts className prop', () => {
      render(
        <Wrapper>
          <Select className="custom-select">
            <option value="1">Option 1</option>
          </Select>
        </Wrapper>
      );

      expect(screen.getByRole('combobox')).toHaveClass('custom-select');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Select.displayName).toBe('Select');
    });
  });
});
