import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test-utils';
import { LinkBox } from '../LinkBox';

describe('LinkBox', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<LinkBox>Link Content</LinkBox>);

      expect(screen.getByText('Link Content')).toBeInTheDocument();
    });

    it('renders with image as string', () => {
      const { container } = render(<LinkBox image="https://example.com/image.jpg">Content</LinkBox>);

      // Image with empty alt has role="presentation"
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders with image as ReactNode', () => {
      render(
        <LinkBox image={<span data-testid="custom-image">Custom</span>}>Content</LinkBox>
      );

      expect(screen.getByTestId('custom-image')).toBeInTheDocument();
    });

    it('applies link-box class', () => {
      const { container } = render(<LinkBox>Content</LinkBox>);

      expect(container.querySelector('.link-box')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<LinkBox className="custom-class">Content</LinkBox>);

      expect(container.querySelector('.link-box')).toHaveClass('custom-class');
    });
  });

  describe('as external link (href)', () => {
    it('renders as anchor with href', () => {
      render(<LinkBox href="https://example.com">External Link</LinkBox>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('has rel=noreferrer for external links', () => {
      render(<LinkBox href="https://example.com">External Link</LinkBox>);

      expect(screen.getByRole('link')).toHaveAttribute('rel', 'noreferrer');
    });
  });

  describe('as internal link (to)', () => {
    it('renders as Link component with to prop', () => {
      render(<LinkBox to="/internal-page">Internal Link</LinkBox>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/internal-page');
    });
  });

  describe('as div (no link)', () => {
    it('renders as div when no href or to', () => {
      const { container } = render(<LinkBox>Just a Box</LinkBox>);

      expect(container.querySelector('a')).not.toBeInTheDocument();
      expect(container.querySelector('div.link-box')).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('has link-box-img container', () => {
      const { container } = render(<LinkBox image="test.jpg">Content</LinkBox>);

      expect(container.querySelector('.link-box-img')).toBeInTheDocument();
    });

    it('has link-box-text container', () => {
      const { container } = render(<LinkBox>Content</LinkBox>);

      expect(container.querySelector('.link-box-text')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(LinkBox.displayName).toBe('LinkBox');
    });
  });
});
