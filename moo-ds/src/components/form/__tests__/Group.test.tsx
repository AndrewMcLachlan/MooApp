import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Group } from '../Group';
import { Label } from '../Label';
import { Input } from '../Input';

const Wrapper: React.FC<{ children: React.ReactNode; defaultValues?: Record<string, any> }> = ({
  children,
  defaultValues = {},
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

describe('Group', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Wrapper>
          <Group groupId="testField">
            <span data-testid="child">Child content</span>
          </Group>
        </Wrapper>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies form-group class', () => {
      const { container } = render(
        <Wrapper>
          <Group groupId="testField">
            Content
          </Group>
        </Wrapper>
      );

      expect(container.querySelector('.form-group')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Wrapper>
          <Group groupId="testField" className="custom-group">
            Content
          </Group>
        </Wrapper>
      );

      expect(container.querySelector('.custom-group')).toBeInTheDocument();
      expect(container.querySelector('.form-group')).toBeInTheDocument();
    });
  });

  describe('show prop', () => {
    it('renders when show is true', () => {
      render(
        <Wrapper>
          <Group groupId="testField" show={true}>
            <span data-testid="visible">Visible</span>
          </Group>
        </Wrapper>
      );

      expect(screen.getByTestId('visible')).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
      render(
        <Wrapper>
          <Group groupId="testField" show={false}>
            <span data-testid="hidden">Hidden</span>
          </Group>
        </Wrapper>
      );

      expect(screen.queryByTestId('hidden')).not.toBeInTheDocument();
    });

    it('defaults show to true', () => {
      render(
        <Wrapper>
          <Group groupId="testField">
            <span data-testid="default">Default visible</span>
          </Group>
        </Wrapper>
      );

      expect(screen.getByTestId('default')).toBeInTheDocument();
    });
  });

  describe('groupId context', () => {
    it('provides groupId to Label', () => {
      render(
        <Wrapper>
          <Group groupId="myField">
            <Label>My Label</Label>
          </Group>
        </Wrapper>
      );

      expect(screen.getByText('My Label')).toHaveAttribute('for', 'myField');
    });

    it('provides groupId to Input', () => {
      render(
        <Wrapper>
          <Group groupId="myField">
            <Input />
          </Group>
        </Wrapper>
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'myField');
    });

    it('connects Label and Input via groupId', () => {
      render(
        <Wrapper>
          <Group groupId="connectedField">
            <Label>Connected Label</Label>
            <Input />
          </Group>
        </Wrapper>
      );

      expect(screen.getByText('Connected Label')).toHaveAttribute('for', 'connectedField');
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'connectedField');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Group.displayName).toBe('Group');
    });
  });
});
