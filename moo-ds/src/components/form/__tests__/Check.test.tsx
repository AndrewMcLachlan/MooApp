import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Check } from '../Check';
import { FromGroupProvider } from '../FormGroupProvider';

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FromGroupProvider groupId="testCheck">
        {children}
      </FromGroupProvider>
    </FormProvider>
  );
};

describe('Check', () => {
  describe('rendering', () => {
    it('renders checkbox input', () => {
      render(
        <Wrapper>
          <Check />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with type checkbox', () => {
      render(
        <Wrapper>
          <Check />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toHaveAttribute('type', 'checkbox');
    });

    it('applies form-check-input class', () => {
      render(
        <Wrapper>
          <Check />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toHaveClass('form-check-input');
    });
  });

  describe('label', () => {
    it('renders the label text', () => {
      render(
        <Wrapper>
          <Check label="I agree to the terms" />
        </Wrapper>
      );

      expect(screen.getByLabelText('I agree to the terms')).toBeInTheDocument();
    });

    it('does not leak label onto the input as an attribute', () => {
      render(
        <Wrapper>
          <Check label="Accept" />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).not.toHaveAttribute('label');
    });

    it('wraps the control in a form-check', () => {
      const { container } = render(
        <Wrapper>
          <Check label="Accept" />
        </Wrapper>
      );

      expect(container.querySelector('.form-check')).toBeInTheDocument();
    });
  });

  describe('type', () => {
    it('renders a radio when asked', () => {
      render(
        <Wrapper>
          <Check type="radio" label="Monthly" />
        </Wrapper>
      );

      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('styles a radio as a check, not a text box', () => {
      render(
        <Wrapper>
          <Check type="radio" label="Monthly" />
        </Wrapper>
      );

      expect(screen.getByRole('radio')).toHaveClass('form-check-input');
      expect(screen.getByRole('radio')).not.toHaveClass('form-control');
    });
  });

  describe('id', () => {
    it('uses groupId as id', () => {
      render(
        <Wrapper>
          <Check />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'testCheck');
    });

    it('uses custom id when provided', () => {
      render(
        <Wrapper>
          <Check id="customId" />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'customId');
    });
  });

  describe('checked state', () => {
    it('renders unchecked by default', () => {
      render(
        <Wrapper>
          <Check />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders checked when default value is true', () => {
      render(
        <Wrapper defaultValues={{ testCheck: true }}>
          <Check />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('toggles checked state when clicked', () => {
      render(
        <Wrapper>
          <Check />
        </Wrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });
  });

  describe('props', () => {
    it('accepts disabled prop', () => {
      render(
        <Wrapper>
          <Check disabled />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('accepts className prop', () => {
      render(
        <Wrapper>
          <Check className="custom-check" />
        </Wrapper>
      );

      expect(screen.getByRole('checkbox')).toHaveClass('custom-check');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Check.displayName).toBe('Check');
    });
  });
});
