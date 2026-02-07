import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Icon } from '../Icon';
import { faCheck, faUser } from '@fortawesome/free-solid-svg-icons';

// Mock custom icon component
const MockCustomIcon = ({ className, onClick, title }: any) => (
  <svg data-testid="custom-icon" className={className} onClick={onClick} title={title}>
    <path d="M0 0h24v24H0z" />
  </svg>
);

describe('Icon', () => {
  describe('FontAwesome icons', () => {
    it('renders FontAwesome icon', () => {
      const { container } = render(<Icon icon={faCheck} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-icon', 'check');
    });

    it('renders different FontAwesome icons', () => {
      const { container } = render(<Icon icon={faUser} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('data-icon', 'user');
    });

    it('applies className to FontAwesome icon', () => {
      const { container } = render(<Icon icon={faCheck} className="custom-class" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('renders FontAwesome icon with title prop', () => {
      // FontAwesome handles title rendering internally
      // We verify the icon renders without error when title is provided
      const { container } = render(<Icon icon={faCheck} title="Check icon" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('data-icon', 'check');
    });

    it('handles click on FontAwesome icon', () => {
      const onClick = vi.fn();
      const { container } = render(<Icon icon={faCheck} onClick={onClick} />);

      const svg = container.querySelector('svg');
      fireEvent.click(svg!);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('adds clickable class when onClick is provided', () => {
      const { container } = render(<Icon icon={faCheck} onClick={() => {}} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('clickable');
    });

    it('does not add clickable class when onClick is not provided', () => {
      const { container } = render(<Icon icon={faCheck} />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveClass('clickable');
    });
  });

  describe('custom React component icons', () => {
    it('renders custom component icon', () => {
      render(<Icon icon={MockCustomIcon} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('applies className to custom icon', () => {
      render(<Icon icon={MockCustomIcon} className="my-class" />);

      const icon = screen.getByTestId('custom-icon');
      expect(icon).toHaveClass('custom-icon');
      expect(icon).toHaveClass('my-class');
    });

    it('applies title to custom icon', () => {
      render(<Icon icon={MockCustomIcon} title="Custom title" />);

      expect(screen.getByTestId('custom-icon')).toHaveAttribute('title', 'Custom title');
    });

    it('handles click on custom icon', () => {
      const onClick = vi.fn();
      render(<Icon icon={MockCustomIcon} onClick={onClick} />);

      fireEvent.click(screen.getByTestId('custom-icon'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('adds clickable class to custom icon when onClick is provided', () => {
      render(<Icon icon={MockCustomIcon} onClick={() => {}} />);

      expect(screen.getByTestId('custom-icon')).toHaveClass('clickable');
    });
  });

  describe('undefined icon', () => {
    it('renders nothing when icon is undefined and no src', () => {
      const { container } = render(<Icon />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Icon.displayName).toBe('Icon');
    });
  });
});
