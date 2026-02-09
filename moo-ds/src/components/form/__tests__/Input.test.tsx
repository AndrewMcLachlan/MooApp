import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '../Input';
import { FromGroupProvider } from '../FormGroupProvider';

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FromGroupProvider groupId="testInput">
        {children}
      </FromGroupProvider>
    </FormProvider>
  );
};

describe('Input', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      render(
        <Wrapper>
          <Input />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('applies form-control class for text input', () => {
      render(
        <Wrapper>
          <Input />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveClass('form-control');
    });

    it('applies form-check-input class for checkbox', () => {
      render(
        <Wrapper>
          <Input type="checkbox" />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toHaveClass('form-check-input');
    });
  });

  describe('id', () => {
    it('uses groupId as id', () => {
      render(
        <Wrapper>
          <Input />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'testInput');
    });

    it('uses custom id when provided', () => {
      render(
        <Wrapper>
          <Input id="customId" />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'customId');
    });
  });

  describe('value handling', () => {
    it('displays default value', () => {
      render(
        <Wrapper defaultValues={{ testInput: 'default text' }}>
          <Input />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveValue('default text');
    });

    it('updates value on input', async () => {
      const user = userEvent.setup();
      render(
        <Wrapper>
          <Input />
        </Wrapper>
      );

      await user.type(screen.getByRole('textbox'), 'new text');

      expect(screen.getByRole('textbox')).toHaveValue('new text');
    });
  });

  describe('number type', () => {
    it('renders number input', () => {
      render(
        <Wrapper>
          <Input type="number" />
        </Wrapper>
      );

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('handles number values', () => {
      render(
        <Wrapper defaultValues={{ testInput: 42 }}>
          <Input type="number" />
        </Wrapper>
      );

      expect(screen.getByRole('spinbutton')).toHaveValue(42);
    });
  });

  describe('clearable', () => {
    it('renders clearable input when clearable is true', () => {
      const { container } = render(
        <Wrapper>
          <Input clearable />
        </Wrapper>
      );

      expect(container.querySelector('.clearable')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('accepts placeholder prop', () => {
      render(
        <Wrapper>
          <Input placeholder="Enter text" />
        </Wrapper>
      );

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('accepts disabled prop', () => {
      render(
        <Wrapper>
          <Input disabled />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('accepts className prop', () => {
      render(
        <Wrapper>
          <Input className="custom-input" />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Input.displayName).toBe('Input');
    });
  });
});
