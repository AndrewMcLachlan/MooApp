import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeader } from '../SectionHeader';

describe('SectionHeader', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<SectionHeader>Header content</SectionHeader>);

      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('applies header class', () => {
      const { container } = render(<SectionHeader>Content</SectionHeader>);

      expect(container.querySelector('.header')).toBeInTheDocument();
    });

    it('renders as div', () => {
      const { container } = render(<SectionHeader>Content</SectionHeader>);

      expect(container.querySelector('div.header')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <SectionHeader>
          <h2>Title</h2>
          <button>Action</button>
        </SectionHeader>
      );

      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
