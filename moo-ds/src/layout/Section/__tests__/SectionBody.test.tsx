import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionBody } from '../SectionBody';

describe('SectionBody', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<SectionBody>Body content</SectionBody>);

      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('applies body class', () => {
      const { container } = render(<SectionBody>Content</SectionBody>);

      expect(container.querySelector('.body')).toBeInTheDocument();
    });

    it('renders as div', () => {
      const { container } = render(<SectionBody>Content</SectionBody>);

      expect(container.querySelector('div.body')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <SectionBody>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </SectionBody>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });
});
