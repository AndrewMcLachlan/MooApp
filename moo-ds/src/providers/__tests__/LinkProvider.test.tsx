import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { LinkProvider, useLink, useNavLink } from '../LinkProvider';
import { LinkComponent, NavLinkComponent } from '../../models';

// Mock Link component
const MockLink: LinkComponent = ({ to, href, className, children, ...rest }) => (
  <a href={to || href} className={className} data-testid="mock-link" {...rest}>
    {children}
  </a>
);

// Mock NavLink component
const MockNavLink: NavLinkComponent = ({ to, href, className, children, ...rest }) => {
  const classNameResult = typeof className === 'function'
    ? className({ isActive: false })
    : className;
  return (
    <a href={to || href} className={classNameResult} data-testid="mock-navlink" {...rest}>
      {children}
    </a>
  );
};

describe('LinkProvider', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
          <div data-testid="child">Child content</div>
        </LinkProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('useLink hook', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // The error occurs during destructuring before the custom check
      // because context is null (not undefined with an empty Link)
      expect(() => {
        renderHook(() => useLink());
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it('returns Link component when used inside provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
          {children}
        </LinkProvider>
      );

      const { result } = renderHook(() => useLink(), { wrapper });

      expect(result.current).toBe(MockLink);
    });

    it('can render the provided Link component', () => {
      const TestComponent = () => {
        const Link = useLink();
        return <Link to="/test">Test Link</Link>;
      };

      render(
        <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
          <TestComponent />
        </LinkProvider>
      );

      const link = screen.getByTestId('mock-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveTextContent('Test Link');
    });
  });

  describe('useNavLink hook', () => {
    it('throws error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // The error occurs during destructuring before the custom check
      // because context is null (not undefined with an empty NavLink)
      expect(() => {
        renderHook(() => useNavLink());
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it('returns NavLink component when used inside provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
          {children}
        </LinkProvider>
      );

      const { result } = renderHook(() => useNavLink(), { wrapper });

      expect(result.current).toBe(MockNavLink);
    });

    it('can render the provided NavLink component', () => {
      const TestComponent = () => {
        const NavLink = useNavLink();
        return <NavLink to="/nav-test">Nav Link</NavLink>;
      };

      render(
        <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
          <TestComponent />
        </LinkProvider>
      );

      const navLink = screen.getByTestId('mock-navlink');
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute('href', '/nav-test');
      expect(navLink).toHaveTextContent('Nav Link');
    });
  });

  describe('custom Link implementations', () => {
    it('works with different Link implementations', () => {
      const CustomLink: LinkComponent = ({ to, children }) => (
        <button data-href={to} data-testid="custom-link">
          {children}
        </button>
      );

      const CustomNavLink: NavLinkComponent = ({ to, children }) => (
        <button data-href={to} data-testid="custom-navlink">
          {children}
        </button>
      );

      const TestComponent = () => {
        const Link = useLink();
        const NavLink = useNavLink();
        return (
          <>
            <Link to="/link">Link</Link>
            <NavLink to="/navlink">NavLink</NavLink>
          </>
        );
      };

      render(
        <LinkProvider LinkComponent={CustomLink} NavLinkComponent={CustomNavLink}>
          <TestComponent />
        </LinkProvider>
      );

      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
      expect(screen.getByTestId('custom-navlink')).toBeInTheDocument();
    });

    it('passes through additional props', () => {
      const TestComponent = () => {
        const Link = useLink();
        return (
          <Link to="/test" className="custom-class" data-custom="value">
            Link with props
          </Link>
        );
      };

      render(
        <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
          <TestComponent />
        </LinkProvider>
      );

      const link = screen.getByTestId('mock-link');
      expect(link).toHaveClass('custom-class');
      expect(link).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('NavLink className function', () => {
    it('supports function className for NavLink', () => {
      const NavLinkWithActiveClass: NavLinkComponent = ({ to, className, children }) => {
        const classNameResult = typeof className === 'function'
          ? className({ isActive: true })
          : className;
        return (
          <a href={to} className={classNameResult} data-testid="active-navlink">
            {children}
          </a>
        );
      };

      const TestComponent = () => {
        const NavLink = useNavLink();
        return (
          <NavLink
            to="/active"
            className={({ isActive }) => isActive ? 'active' : 'inactive'}
          >
            Active Link
          </NavLink>
        );
      };

      render(
        <LinkProvider LinkComponent={MockLink} NavLinkComponent={NavLinkWithActiveClass}>
          <TestComponent />
        </LinkProvider>
      );

      expect(screen.getByTestId('active-navlink')).toHaveClass('active');
    });
  });

  describe('nested providers', () => {
    it('inner provider overrides outer provider', () => {
      const OuterLink: LinkComponent = ({ children }) => (
        <span data-testid="outer-link">{children}</span>
      );
      const InnerLink: LinkComponent = ({ children }) => (
        <span data-testid="inner-link">{children}</span>
      );

      const TestComponent = () => {
        const Link = useLink();
        return <Link to="/test">Link</Link>;
      };

      render(
        <LinkProvider LinkComponent={OuterLink} NavLinkComponent={MockNavLink}>
          <LinkProvider LinkComponent={InnerLink} NavLinkComponent={MockNavLink}>
            <TestComponent />
          </LinkProvider>
        </LinkProvider>
      );

      expect(screen.getByTestId('inner-link')).toBeInTheDocument();
      expect(screen.queryByTestId('outer-link')).not.toBeInTheDocument();
    });
  });
});
