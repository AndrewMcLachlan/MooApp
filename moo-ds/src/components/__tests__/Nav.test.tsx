import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Nav } from '../Nav';

describe('Nav', () => {
  describe('Nav component', () => {
    it('renders children', () => {
      render(<Nav>Content</Nav>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies nav class', () => {
      render(<Nav data-testid="nav">Content</Nav>);
      expect(screen.getByTestId('nav')).toHaveClass('nav');
    });

    it('renders as nav by default', () => {
      render(<Nav data-testid="nav">Content</Nav>);
      expect(screen.getByTestId('nav').tagName).toBe('NAV');
    });

    it('renders with as prop', () => {
      render(<Nav as="ul" data-testid="nav">Content</Nav>);
      expect(screen.getByTestId('nav').tagName).toBe('UL');
    });

    it('applies tabs variant', () => {
      render(<Nav variant="tabs" data-testid="nav">Content</Nav>);
      expect(screen.getByTestId('nav')).toHaveClass('nav-tabs');
    });

    it('applies pills variant', () => {
      render(<Nav variant="pills" data-testid="nav">Content</Nav>);
      expect(screen.getByTestId('nav')).toHaveClass('nav-pills');
    });

    it('applies column class', () => {
      render(<Nav column data-testid="nav">Content</Nav>);
      expect(screen.getByTestId('nav')).toHaveClass('nav-column');
    });

    it('applies custom className', () => {
      render(<Nav className="custom" data-testid="nav">Content</Nav>);
      expect(screen.getByTestId('nav')).toHaveClass('nav', 'custom');
    });

    it('has displayName', () => {
      expect(Nav.displayName).toBe('Nav');
    });
  });

  describe('Nav.Item', () => {
    it('renders children', () => {
      render(<Nav.Item>Item</Nav.Item>);
      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('applies nav-item class', () => {
      render(<Nav.Item data-testid="item">Item</Nav.Item>);
      expect(screen.getByTestId('item')).toHaveClass('nav-item');
    });

    it('renders as div by default', () => {
      render(<Nav.Item data-testid="item">Item</Nav.Item>);
      expect(screen.getByTestId('item').tagName).toBe('DIV');
    });

    it('renders with as prop', () => {
      render(<Nav.Item as="li" data-testid="item">Item</Nav.Item>);
      expect(screen.getByTestId('item').tagName).toBe('LI');
    });

    it('has displayName', () => {
      expect(Nav.Item.displayName).toBe('Nav.Item');
    });
  });

  describe('Nav.Link', () => {
    it('renders children', () => {
      render(<Nav.Link>Link</Nav.Link>);
      expect(screen.getByText('Link')).toBeInTheDocument();
    });

    it('applies nav-link class', () => {
      render(<Nav.Link data-testid="link">Link</Nav.Link>);
      expect(screen.getByTestId('link')).toHaveClass('nav-link');
    });

    it('applies active class', () => {
      render(<Nav.Link active data-testid="link">Link</Nav.Link>);
      expect(screen.getByTestId('link')).toHaveClass('active');
    });

    it('applies disabled class', () => {
      render(<Nav.Link disabled data-testid="link">Link</Nav.Link>);
      expect(screen.getByTestId('link')).toHaveClass('disabled');
    });

    it('renders as anchor by default', () => {
      render(<Nav.Link data-testid="link">Link</Nav.Link>);
      expect(screen.getByTestId('link').tagName).toBe('A');
    });

    it('has displayName', () => {
      expect(Nav.Link.displayName).toBe('Nav.Link');
    });
  });
});
