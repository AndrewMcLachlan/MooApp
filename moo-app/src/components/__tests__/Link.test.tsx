import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from '../Link';

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...rest }: any) => (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  ),
}));

describe('Link', () => {
  describe('rendering', () => {
    it('renders as a link', () => {
      render(<Link to="/test">Link Text</Link>);

      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(<Link to="/test">Link Content</Link>);

      expect(screen.getByText('Link Content')).toBeInTheDocument();
    });

    it('has correct href', () => {
      render(<Link to="/destination">Link</Link>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/destination');
    });
  });

  describe('props', () => {
    it('passes className', () => {
      render(<Link to="/test" className="custom-link">Link</Link>);

      expect(screen.getByRole('link')).toHaveClass('custom-link');
    });

    it('uses href when to is not provided', () => {
      render(<Link href="/fallback">Link</Link>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/fallback');
    });

    it('falls back to empty string when neither to nor href is provided', () => {
      render(<Link>Link</Link>);

      expect(screen.getByText('Link').closest('a')).toHaveAttribute('href', '');
    });

    it('prefers to over href', () => {
      render(<Link to="/primary" href="/secondary">Link</Link>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/primary');
    });

    it('passes additional props through', () => {
      render(<Link to="/test" data-testid="custom-link" role="menuitem">Link</Link>);

      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });
  });
});
