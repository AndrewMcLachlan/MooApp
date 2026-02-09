import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Collapsible } from '../Collapsible';

describe('Collapsible', () => {
  describe('rendering', () => {
    it('renders header', () => {
      render(<Collapsible header="Test Header">Content</Collapsible>);

      expect(screen.getByText('Test Header')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(<Collapsible header="Header">Test Content</Collapsible>);

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders as details element', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      expect(container.querySelector('details')).toBeInTheDocument();
    });

    it('renders summary element', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      expect(container.querySelector('summary')).toBeInTheDocument();
    });

    it('applies collapsible and section classes', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      const details = container.querySelector('details');
      expect(details).toHaveClass('collapsible');
      expect(details).toHaveClass('section');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Collapsible header="Header" className="custom-class">Content</Collapsible>
      );

      const details = container.querySelector('details');
      expect(details).toHaveClass('custom-class');
    });

    it('renders chevron icon', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      expect(container.querySelector('.collapsible-icon')).toBeInTheDocument();
    });
  });

  describe('headerAs prop', () => {
    it('renders header with default span', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      expect(container.querySelector('summary span')).toBeInTheDocument();
    });

    it('renders header with custom element type', () => {
      const { container } = render(
        <Collapsible header="Header" headerAs="h2">Content</Collapsible>
      );

      expect(container.querySelector('summary h2')).toBeInTheDocument();
    });
  });

  describe('collapsible behavior', () => {
    it('starts closed by default', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      expect(container.querySelector('details')).not.toHaveAttribute('open');
    });

    it('can be opened with open prop', () => {
      const { container } = render(
        <Collapsible header="Header" open>Content</Collapsible>
      );

      expect(container.querySelector('details')).toHaveAttribute('open');
    });

    it('toggles open state when clicked', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      const summary = container.querySelector('summary')!;
      fireEvent.click(summary);

      expect(container.querySelector('details')).toHaveAttribute('open');
    });
  });

  describe('content wrapper', () => {
    it('wraps content in collapsible-content div', () => {
      const { container } = render(<Collapsible header="Header">Content</Collapsible>);

      expect(container.querySelector('.collapsible-content')).toBeInTheDocument();
    });
  });
});
