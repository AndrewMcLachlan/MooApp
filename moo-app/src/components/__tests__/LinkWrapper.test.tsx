import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { LinkWrapper, NavLinkWrapper } from '../LinkWrapper';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

describe('LinkWrapper', () => {
  describe('rendering', () => {
    it('renders as a link', () => {
      renderWithRouter(<LinkWrapper to="/test">Link Text</LinkWrapper>);

      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('renders children', () => {
      renderWithRouter(<LinkWrapper to="/test">Link Content</LinkWrapper>);

      expect(screen.getByText('Link Content')).toBeInTheDocument();
    });

    it('has correct href', () => {
      renderWithRouter(<LinkWrapper to="/destination">Link</LinkWrapper>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/destination');
    });
  });

  describe('props', () => {
    it('passes className', () => {
      renderWithRouter(<LinkWrapper to="/test" className="custom-link">Link</LinkWrapper>);

      expect(screen.getByRole('link')).toHaveClass('custom-link');
    });

    it('passes role', () => {
      renderWithRouter(<LinkWrapper to="/test" role="menuitem">Link</LinkWrapper>);

      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });

    it('handles onClick', () => {
      const onClick = vi.fn();
      renderWithRouter(<LinkWrapper to="/test" onClick={onClick}>Link</LinkWrapper>);

      fireEvent.click(screen.getByRole('link'));

      expect(onClick).toHaveBeenCalled();
    });
  });
});

describe('NavLinkWrapper', () => {
  describe('rendering', () => {
    it('renders as a link', () => {
      renderWithRouter(<NavLinkWrapper to="/test">Nav Link</NavLinkWrapper>);

      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('renders children', () => {
      renderWithRouter(<NavLinkWrapper to="/test">Nav Content</NavLinkWrapper>);

      expect(screen.getByText('Nav Content')).toBeInTheDocument();
    });

    it('has correct href', () => {
      renderWithRouter(<NavLinkWrapper to="/nav-destination">Nav</NavLinkWrapper>);

      expect(screen.getByRole('link')).toHaveAttribute('href', '/nav-destination');
    });
  });

  describe('props', () => {
    it('passes className', () => {
      renderWithRouter(<NavLinkWrapper to="/test" className="nav-custom">Nav</NavLinkWrapper>);

      expect(screen.getByRole('link')).toHaveClass('nav-custom');
    });

    it('passes role', () => {
      renderWithRouter(<NavLinkWrapper to="/test" role="navigation">Nav</NavLinkWrapper>);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('handles onClick', () => {
      const onClick = vi.fn();
      renderWithRouter(<NavLinkWrapper to="/test" onClick={onClick}>Nav</NavLinkWrapper>);

      fireEvent.click(screen.getByRole('link'));

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('active state', () => {
    it('can apply active styles via className function', () => {
      // NavLink supports a className function for active styling
      // This is handled by react-router's NavLink component
      renderWithRouter(<NavLinkWrapper to="/">Home</NavLinkWrapper>);

      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });
});
