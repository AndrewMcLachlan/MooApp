import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { Password, passwordMask } from '../Password';
import { FromGroupProvider } from '../FormGroupProvider';

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FromGroupProvider groupId="testPassword">
        {children}
      </FromGroupProvider>
    </FormProvider>
  );
};

describe('Password', () => {
  describe('rendering', () => {
    it('renders password input', () => {
      const { container } = render(
        <Wrapper>
          <Password />
        </Wrapper>
      );

      expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    });

    it('applies form-control class', () => {
      const { container } = render(
        <Wrapper>
          <Password />
        </Wrapper>
      );

      expect(container.querySelector('input')).toHaveClass('form-control');
    });

    it('shows password mask by default', () => {
      const { container } = render(
        <Wrapper>
          <Password />
        </Wrapper>
      );

      expect(container.querySelector('input')).toHaveValue(passwordMask);
    });
  });

  describe('id', () => {
    it('uses groupId as id', () => {
      const { container } = render(
        <Wrapper>
          <Password />
        </Wrapper>
      );

      expect(container.querySelector('input')).toHaveAttribute('id', 'testPassword');
    });

    it('uses custom id when provided', () => {
      const { container } = render(
        <Wrapper>
          <Password id="customId" />
        </Wrapper>
      );

      expect(container.querySelector('input')).toHaveAttribute('id', 'customId');
    });
  });

  describe('focus behavior', () => {
    it('clears password mask on focus', () => {
      const { container } = render(
        <Wrapper>
          <Password />
        </Wrapper>
      );

      const input = container.querySelector('input')!;
      fireEvent.focus(input);

      expect(input).toHaveValue('');
    });

    it('keeps value on focus if not mask', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Wrapper>
          <Password />
        </Wrapper>
      );

      const input = container.querySelector('input')!;

      // Focus to clear mask
      fireEvent.focus(input);

      // Type new password
      await user.type(input, 'mypassword');

      // Blur and focus again
      fireEvent.blur(input);
      fireEvent.focus(input);

      // Should keep the typed password
      expect(input).toHaveValue('mypassword');
    });
  });

  describe('props', () => {
    it('accepts placeholder prop', () => {
      const { container } = render(
        <Wrapper>
          <Password placeholder="Enter password" />
        </Wrapper>
      );

      expect(container.querySelector('input')).toHaveAttribute('placeholder', 'Enter password');
    });

    it('accepts disabled prop', () => {
      const { container } = render(
        <Wrapper>
          <Password disabled />
        </Wrapper>
      );

      expect(container.querySelector('input')).toBeDisabled();
    });

    it('accepts className prop', () => {
      const { container } = render(
        <Wrapper>
          <Password className="custom-password" />
        </Wrapper>
      );

      expect(container.querySelector('input')).toHaveClass('custom-password');
    });
  });

  describe('passwordMask constant', () => {
    it('exports password mask constant', () => {
      expect(passwordMask).toBe('*****************************');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Password.displayName).toBe('Password');
    });
  });
});
