import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test-utils';
import { IconLinkButton } from '../IconLinkButton';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

describe('IconLinkButton', () => {
  describe('rendering', () => {
    it('renders as a link with icon and text', () => {
      render(<IconLinkButton icon={faCheck} to="/test">Click me</IconLinkButton>);

      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders FontAwesome icon', () => {
      const { container } = render(<IconLinkButton icon={faCheck} to="/test">Click me</IconLinkButton>);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-icon', 'check');
    });

    it('applies btn and btn-icon classes', () => {
      render(<IconLinkButton icon={faCheck} to="/test">Click me</IconLinkButton>);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('btn');
      expect(link).toHaveClass('btn-icon');
    });

    it('renders with correct href', () => {
      render(<IconLinkButton icon={faCheck} to="/test-path">Click me</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/test-path');
    });

    it('merges a custom className', () => {
      render(<IconLinkButton icon={faCheck} to="/test" className="custom-class">Click me</IconLinkButton>);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
      expect(link).toHaveClass('btn-icon');
    });
  });

  describe('size and active', () => {
    it('applies the size class', () => {
      render(<IconLinkButton icon={faCheck} to="/test" size="lg">Large</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveClass('btn-lg');
    });

    it('applies the active class', () => {
      render(<IconLinkButton icon={faCheck} to="/test" active>Active</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveClass('active');
    });

    it('does not leak size/active as DOM attributes', () => {
      render(<IconLinkButton icon={faCheck} to="/test" size="lg" active>Click me</IconLinkButton>);

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('size');
      expect(link).not.toHaveAttribute('active');
    });
  });

  describe('badge', () => {
    it('applies btn-icon-badge class and wraps the icon in a panel when badge is true', () => {
      const { container } = render(<IconLinkButton icon={faCheck} to="/add" badge>Add</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveClass('btn-icon-badge');
      const panel = container.querySelector('.btn-icon-panel');
      expect(panel).toBeInTheDocument();
      expect(panel?.querySelector('svg')).toBeInTheDocument();
    });

    it('omits the badge class and panel wrapper by default', () => {
      const { container } = render(<IconLinkButton icon={faCheck} to="/add">Add</IconLinkButton>);

      expect(screen.getByRole('link')).not.toHaveClass('btn-icon-badge');
      expect(container.querySelector('.btn-icon-panel')).not.toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies primary variant', () => {
      render(<IconLinkButton icon={faCheck} to="/test" variant="primary">Primary</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveClass('btn-primary');
    });

    it('applies secondary variant', () => {
      render(<IconLinkButton icon={faCheck} to="/test" variant="secondary">Secondary</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveClass('btn-secondary');
    });

    it('applies danger variant', () => {
      render(<IconLinkButton icon={faCheck} to="/test" variant="danger">Danger</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveClass('btn-danger');
    });

    it('applies outline-primary variant', () => {
      render(<IconLinkButton icon={faCheck} to="/test" variant="outline-primary">Outline</IconLinkButton>);

      expect(screen.getByRole('link')).toHaveClass('btn-outline-primary');
    });
  });

  describe('iconSrc prop', () => {
    it('accepts iconSrc prop', () => {
      const { container } = render(<IconLinkButton iconSrc="/icon.svg" to="/test">With Src</IconLinkButton>);

      expect(container.querySelector('img')).toBeInTheDocument();
    });
  });
});
