import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Popover } from '../Popover';

describe('Popover', () => {
  it('renders with tooltip role', () => {
    render(<Popover id="pop">Content</Popover>);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('applies popover class', () => {
    render(<Popover id="pop">Content</Popover>);
    expect(screen.getByRole('tooltip')).toHaveClass('popover');
  });

  it('applies placement class', () => {
    render(<Popover id="pop" placement="top">Content</Popover>);
    expect(screen.getByRole('tooltip')).toHaveClass('popover-top');
  });

  it('defaults to bottom placement', () => {
    render(<Popover id="pop">Content</Popover>);
    expect(screen.getByRole('tooltip')).toHaveClass('popover-bottom');
  });

  it('sets id attribute', () => {
    render(<Popover id="my-popover">Content</Popover>);
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'my-popover');
  });

  it('applies custom className', () => {
    render(<Popover id="pop" className="custom">Content</Popover>);
    expect(screen.getByRole('tooltip')).toHaveClass('popover', 'custom');
  });

  it('has displayName', () => {
    expect(Popover.displayName).toBe('Popover');
  });

  describe('Popover.Header', () => {
    it('renders with popover-header class', () => {
      render(
        <Popover id="pop">
          <Popover.Header>Title</Popover.Header>
        </Popover>
      );
      expect(screen.getByText('Title')).toHaveClass('popover-header');
    });

    it('has displayName', () => {
      expect(Popover.Header.displayName).toBe('Popover.Header');
    });
  });

  describe('Popover.Body', () => {
    it('renders with popover-body class', () => {
      render(
        <Popover id="pop">
          <Popover.Body>Body text</Popover.Body>
        </Popover>
      );
      expect(screen.getByText('Body text')).toHaveClass('popover-body');
    });

    it('has displayName', () => {
      expect(Popover.Body.displayName).toBe('Popover.Body');
    });
  });
});
