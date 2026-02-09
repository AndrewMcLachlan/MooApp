import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../Avatar';

describe('Avatar', () => {
  describe('rendering', () => {
    it('renders with photo', () => {
      render(<Avatar photo="https://example.com/photo.jpg" name="John Doe" />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
      expect(img).toHaveAttribute('alt', 'Me');
    });

    it('renders initials when no photo provided', () => {
      render(<Avatar name="John Doe" />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders initials for single name', () => {
      render(<Avatar name="John" />);

      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('renders initials for multiple names', () => {
      render(<Avatar name="John Michael Doe" />);

      expect(screen.getByText('JMD')).toBeInTheDocument();
    });

    it('renders empty when no name or photo', () => {
      const { container } = render(<Avatar />);

      expect(container.querySelector('.avatar')).toBeInTheDocument();
      expect(container.querySelector('.initials')).toBeInTheDocument();
    });

    it('prefers photo over initials', () => {
      render(<Avatar photo="https://example.com/photo.jpg" name="John Doe" />);

      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.queryByText('JD')).not.toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('has avatar class', () => {
      const { container } = render(<Avatar name="John Doe" />);

      expect(container.querySelector('.avatar')).toBeInTheDocument();
    });

    it('has clickable class', () => {
      const { container } = render(<Avatar name="John Doe" />);

      expect(container.querySelector('.clickable')).toBeInTheDocument();
    });

    it('has initials class when showing initials', () => {
      const { container } = render(<Avatar name="John Doe" />);

      expect(container.querySelector('.initials')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Avatar.displayName).toBe('Avatar');
    });
  });
});
