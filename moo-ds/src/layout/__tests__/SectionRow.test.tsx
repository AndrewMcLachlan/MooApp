import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionRow } from '../SectionRow';

describe('SectionRow', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<SectionRow>Row content</SectionRow>);

      expect(screen.getByText('Row content')).toBeInTheDocument();
    });

    it('applies section-row class', () => {
      const { container } = render(<SectionRow>Content</SectionRow>);

      expect(container.querySelector('.section-row')).toBeInTheDocument();
    });

    it('applies row class (from Bootstrap)', () => {
      const { container } = render(<SectionRow>Content</SectionRow>);

      expect(container.querySelector('.row')).toBeInTheDocument();
    });

    it('renders as Bootstrap Row', () => {
      const { container } = render(<SectionRow>Content</SectionRow>);

      // Row renders as div with row class
      expect(container.querySelector('div.row')).toBeInTheDocument();
    });
  });

  describe('Row props', () => {
    it('accepts additional Row props', () => {
      const { container } = render(
        <SectionRow className="custom-row">Content</SectionRow>
      );

      expect(container.querySelector('.row')).toHaveClass('custom-row');
    });

    it('renders multiple children', () => {
      render(
        <SectionRow>
          <div data-testid="col1">Column 1</div>
          <div data-testid="col2">Column 2</div>
        </SectionRow>
      );

      expect(screen.getByTestId('col1')).toBeInTheDocument();
      expect(screen.getByTestId('col2')).toBeInTheDocument();
    });
  });
});
