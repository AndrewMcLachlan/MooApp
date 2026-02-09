import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionSubheading } from '../SectionSubheading';

describe('SectionSubheading', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<SectionSubheading>Subheading text</SectionSubheading>);

      expect(screen.getByText('Subheading text')).toBeInTheDocument();
    });

    it('applies subheading class', () => {
      const { container } = render(<SectionSubheading>Content</SectionSubheading>);

      expect(container.querySelector('.subheading')).toBeInTheDocument();
    });

    it('renders as h3 by default', () => {
      render(<SectionSubheading>Content</SectionSubheading>);

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('renders as h1 when size is 1', () => {
      render(<SectionSubheading size={1}>Content</SectionSubheading>);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders as h2 when size is 2', () => {
      render(<SectionSubheading size={2}>Content</SectionSubheading>);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('renders as h4 when size is 4', () => {
      render(<SectionSubheading size={4}>Content</SectionSubheading>);

      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    });

    it('renders as h5 when size is 5', () => {
      render(<SectionSubheading size={5}>Content</SectionSubheading>);

      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument();
    });

    it('renders as h6 when size is 6', () => {
      render(<SectionSubheading size={6}>Content</SectionSubheading>);

      expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
    });
  });
});
