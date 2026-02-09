import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '../Label';
import { FromGroupProvider } from '../FormGroupProvider';

describe('Label', () => {
  describe('rendering', () => {
    it('renders label element', () => {
      render(
        <FromGroupProvider groupId="testField">
          <Label>Field Label</Label>
        </FromGroupProvider>
      );

      expect(screen.getByText('Field Label')).toBeInTheDocument();
      expect(screen.getByText('Field Label').tagName.toLowerCase()).toBe('label');
    });

    it('applies form-label class', () => {
      render(
        <FromGroupProvider groupId="testField">
          <Label>Label</Label>
        </FromGroupProvider>
      );

      expect(screen.getByText('Label')).toHaveClass('form-label');
    });
  });

  describe('htmlFor', () => {
    it('uses groupId for htmlFor', () => {
      render(
        <FromGroupProvider groupId="testField">
          <Label>Label</Label>
        </FromGroupProvider>
      );

      expect(screen.getByText('Label')).toHaveAttribute('for', 'testField');
    });

    it('uses custom htmlFor when provided', () => {
      render(
        <FromGroupProvider groupId="testField">
          <Label htmlFor="customField">Label</Label>
        </FromGroupProvider>
      );

      expect(screen.getByText('Label')).toHaveAttribute('for', 'customField');
    });

    it('works without FormGroupProvider (undefined groupId)', () => {
      render(<Label>Label</Label>);

      // Should render without error, htmlFor will be undefined
      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });

  describe('children', () => {
    it('renders text children', () => {
      render(
        <FromGroupProvider groupId="test">
          <Label>Text Label</Label>
        </FromGroupProvider>
      );

      expect(screen.getByText('Text Label')).toBeInTheDocument();
    });

    it('renders element children', () => {
      render(
        <FromGroupProvider groupId="test">
          <Label>
            <span data-testid="label-content">Complex Label</span>
          </Label>
        </FromGroupProvider>
      );

      expect(screen.getByTestId('label-content')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('accepts className prop', () => {
      render(
        <FromGroupProvider groupId="test">
          <Label className="custom-label">Label</Label>
        </FromGroupProvider>
      );

      expect(screen.getByText('Label')).toHaveClass('custom-label');
      expect(screen.getByText('Label')).toHaveClass('form-label');
    });

    it('passes through additional props', () => {
      render(
        <FromGroupProvider groupId="test">
          <Label data-testid="my-label">Label</Label>
        </FromGroupProvider>
      );

      expect(screen.getByTestId('my-label')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Label.displayName).toBe('Label');
    });
  });
});
