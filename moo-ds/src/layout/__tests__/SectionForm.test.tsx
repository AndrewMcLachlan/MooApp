import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { SectionForm } from '../SectionForm';

interface FormData {
  name: string;
}

// Wrapper component that provides form context
const TestSectionForm: React.FC<{
  onSubmit?: (data: FormData) => void;
  header?: string | React.ReactNode;
  headerSize?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}> = ({ onSubmit = () => {}, header, headerSize, children }) => {
  const form = useForm<FormData>({ defaultValues: { name: '' } });
  return (
    <SectionForm<FormData> form={form} onSubmit={onSubmit} header={header} headerSize={headerSize}>
      {children}
    </SectionForm>
  );
};

describe('SectionForm', () => {
  describe('rendering', () => {
    it('renders form with section class', () => {
      const { container } = render(
        <TestSectionForm>
          <input name="name" />
        </TestSectionForm>
      );

      expect(container.querySelector('form.section')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <TestSectionForm>
          <span data-testid="child">Child content</span>
        </TestSectionForm>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders string header as h2 by default', () => {
      render(
        <TestSectionForm header="Form Title">
          Content
        </TestSectionForm>
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Form Title');
    });

    it('renders ReactNode header directly', () => {
      render(
        <TestSectionForm header={<h3>Custom Header</h3>}>
          Content
        </TestSectionForm>
      );

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Custom Header');
    });
  });

  describe('headerSize prop', () => {
    it('renders header as h1 when headerSize is 1', () => {
      render(
        <TestSectionForm header="Title" headerSize={1}>
          Content
        </TestSectionForm>
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders header as h3 when headerSize is 3', () => {
      render(
        <TestSectionForm header="Title" headerSize={3}>
          Content
        </TestSectionForm>
      );

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('form functionality', () => {
    it('calls onSubmit when form is submitted', async () => {
      const onSubmit = vi.fn();
      render(
        <TestSectionForm onSubmit={onSubmit}>
          <button type="submit">Submit</button>
        </TestSectionForm>
      );

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });
});
