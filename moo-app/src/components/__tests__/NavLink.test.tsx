import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavLink } from '../NavLink';

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, activeProps, ...rest }: any) => (
    <a href={to} className={className} data-active-class={activeProps?.className} {...rest}>
      {children}
    </a>
  ),
}));

describe('NavLink', () => {
  describe('rendering', () => {
    it('renders as a link', () => {
      render(<NavLink to="/test">Link Text</NavLink>);

      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(<NavLink to="/test">Link Content</NavLink>);

      expect(screen.getByText('Link Content')).toBeInTheDocument();
    });

    it('has correct href', () => {
      render(<NavLink to="/destination">Link</NavLink>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/destination');
    });
  });

  describe('props', () => {
    it('passes string className', () => {
      render(<NavLink to="/test" className="custom-link">Link</NavLink>);

      expect(screen.getByRole('link')).toHaveClass('custom-link');
    });

    it('uses href when to is not provided', () => {
      render(<NavLink href="/fallback">Link</NavLink>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/fallback');
    });
  });

  describe('active state', () => {
    it('resolves className function for active and inactive states', () => {
      const classNameFn = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'active-class' : 'inactive-class';

      render(<NavLink to="/test" className={classNameFn}>Link</NavLink>);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('inactive-class');
      expect(link).toHaveAttribute('data-active-class', 'active-class');
    });
  });
});
