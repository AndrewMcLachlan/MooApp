import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { RadioGroup } from '../RadioGroup';
import { Radio } from '../Radio';
import { FromGroupProvider } from '../FormGroupProvider';

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FromGroupProvider groupId="billing">{children}</FromGroupProvider>
    </FormProvider>
  );
};

const options = (
  <>
    <Radio value="monthly" label="Monthly" />
    <Radio value="yearly" label="Yearly" />
  </>
);

describe('RadioGroup', () => {
  describe('grouping', () => {
    // The whole point of the component: options of one question are one field.
    it('registers every option against the group name', () => {
      render(<Wrapper><RadioGroup legend="Billing period">{options}</RadioGroup></Wrapper>);

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
      radios.forEach((r) => expect(r).toHaveAttribute('name', 'billing'));
    });

    it('gives each option its own id', () => {
      render(<Wrapper><RadioGroup legend="Billing period">{options}</RadioGroup></Wrapper>);

      const ids = screen.getAllByRole('radio').map((r) => r.getAttribute('id'));
      expect(new Set(ids).size).toBe(2);
      expect(ids).toEqual(['billing-monthly', 'billing-yearly']);
    });

    it('takes an explicit name over the group id', () => {
      render(<Wrapper><RadioGroup name="period" legend="Period">{options}</RadioGroup></Wrapper>);

      screen.getAllByRole('radio').forEach((r) => expect(r).toHaveAttribute('name', 'period'));
    });
  });

  describe('accessible name', () => {
    // A label cannot name a radio group -- there is no single control for it to
    // point at. A fieldset with a legend is the markup that can.
    it('renders a fieldset with the legend as the group name', () => {
      const { container } = render(
        <Wrapper><RadioGroup legend="Billing period">{options}</RadioGroup></Wrapper>
      );

      const fieldset = container.querySelector('fieldset');
      expect(fieldset).toBeInTheDocument();
      expect(fieldset?.querySelector('legend')).toHaveTextContent('Billing period');
      expect(screen.getByRole('group', { name: 'Billing period' })).toBeInTheDocument();
    });

    it('labels each option', () => {
      render(<Wrapper><RadioGroup legend="Billing period">{options}</RadioGroup></Wrapper>);

      expect(screen.getByLabelText('Monthly')).toBeInTheDocument();
      expect(screen.getByLabelText('Yearly')).toBeInTheDocument();
    });
  });

  describe('value binding', () => {
    it('checks the option matching the form value', () => {
      render(
        <Wrapper defaultValues={{ billing: 'yearly' }}>
          <RadioGroup legend="Billing period">{options}</RadioGroup>
        </Wrapper>
      );

      expect(screen.getByLabelText('Yearly')).toBeChecked();
      expect(screen.getByLabelText('Monthly')).not.toBeChecked();
    });

    it('moves the selection on click', () => {
      render(
        <Wrapper defaultValues={{ billing: 'monthly' }}>
          <RadioGroup legend="Billing period">{options}</RadioGroup>
        </Wrapper>
      );

      fireEvent.click(screen.getByLabelText('Yearly'));

      expect(screen.getByLabelText('Yearly')).toBeChecked();
      expect(screen.getByLabelText('Monthly')).not.toBeChecked();
    });
  });

  describe('appearance', () => {
    it('defaults to checks', () => {
      const { container } = render(
        <Wrapper><RadioGroup legend="Billing period">{options}</RadioGroup></Wrapper>
      );

      expect(container.querySelector('.btn-group')).not.toBeInTheDocument();
      screen.getAllByRole('radio').forEach((r) => expect(r).toHaveClass('form-check-input'));
    });

    it('renders a button group when asked', () => {
      const { container } = render(
        <Wrapper><RadioGroup legend="Billing period" appearance="buttons">{options}</RadioGroup></Wrapper>
      );

      expect(container.querySelector('.btn-group')).toBeInTheDocument();
      screen.getAllByRole('radio').forEach((r) => expect(r).toHaveClass('btn-check'));
    });

    // The label must be the input's next sibling or `.btn-check:checked + .btn`
    // never matches and the group shows no selection.
    it('keeps each button label as the input\u0027s next sibling', () => {
      const { container } = render(
        <Wrapper><RadioGroup legend="Billing period" appearance="buttons">{options}</RadioGroup></Wrapper>
      );

      container.querySelectorAll('.btn-check').forEach((input) => {
        expect(input.nextElementSibling).toHaveClass('btn');
      });
    });

    // Buttons are still radios: same semantics, different skin.
    it('stays a radio group in the button appearance', () => {
      render(
        <Wrapper defaultValues={{ billing: 'monthly' }}>
          <RadioGroup legend="Billing period" appearance="buttons">{options}</RadioGroup>
        </Wrapper>
      );

      expect(screen.getAllByRole('radio')).toHaveLength(2);
      fireEvent.click(screen.getByLabelText('Yearly'));
      expect(screen.getByLabelText('Yearly')).toBeChecked();
    });
  });

  describe('outside a form', () => {
    it('renders as plain radios with no form to bind to', () => {
      render(<RadioGroup name="standalone" legend="Period">{options}</RadioGroup>);

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
      radios.forEach((r) => expect(r).toHaveAttribute('name', 'standalone'));
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(RadioGroup.displayName).toBe('RadioGroup');
      expect(Radio.displayName).toBe('Radio');
    });
  });
});
