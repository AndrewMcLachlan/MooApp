import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { TextArea } from '../TextArea';
import { FromGroupProvider } from '../FormGroupProvider';

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FromGroupProvider groupId="testTextArea">
        {children}
      </FromGroupProvider>
    </FormProvider>
  );
};

describe('TextArea', () => {
  describe('rendering', () => {
    it('renders textarea element', () => {
      render(
        <Wrapper>
          <TextArea />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('textbox').tagName.toLowerCase()).toBe('textarea');
    });

    it('applies form-control class', () => {
      render(
        <Wrapper>
          <TextArea />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveClass('form-control');
    });
  });

  describe('id', () => {
    it('uses groupId as id', () => {
      render(
        <Wrapper>
          <TextArea />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'testTextArea');
    });

    it('uses custom id when provided', () => {
      render(
        <Wrapper>
          <TextArea id="customId" />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'customId');
    });
  });

  describe('value handling', () => {
    it('displays default value', () => {
      render(
        <Wrapper defaultValues={{ testTextArea: 'default text content' }}>
          <TextArea />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveValue('default text content');
    });

    it('updates value on input', async () => {
      const user = userEvent.setup();
      render(
        <Wrapper>
          <TextArea />
        </Wrapper>
      );

      await user.type(screen.getByRole('textbox'), 'new content');

      expect(screen.getByRole('textbox')).toHaveValue('new content');
    });

    it('handles multiline content', async () => {
      const user = userEvent.setup();
      render(
        <Wrapper>
          <TextArea />
        </Wrapper>
      );

      await user.type(screen.getByRole('textbox'), 'line1{enter}line2');

      expect(screen.getByRole('textbox')).toHaveValue('line1\nline2');
    });
  });

  describe('props', () => {
    it('accepts placeholder prop', () => {
      render(
        <Wrapper>
          <TextArea placeholder="Enter description" />
        </Wrapper>
      );

      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('accepts disabled prop', () => {
      render(
        <Wrapper>
          <TextArea disabled />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('accepts rows prop', () => {
      render(
        <Wrapper>
          <TextArea rows={5} />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
    });

    it('accepts className prop', () => {
      render(
        <Wrapper>
          <TextArea className="custom-textarea" />
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(TextArea.displayName).toBe('TextArea');
    });
  });
});
