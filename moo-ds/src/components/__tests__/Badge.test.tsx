import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies badge class', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveClass('badge');
  });

  it('defaults to primary bg', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveClass('bg-primary');
  });

  it('applies custom bg', () => {
    render(<Badge bg="danger">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-danger');
  });

  it('applies pill class', () => {
    render(<Badge pill>Pill</Badge>);
    expect(screen.getByText('Pill')).toHaveClass('rounded-pill');
  });

  it('does not apply pill class by default', () => {
    render(<Badge>Normal</Badge>);
    expect(screen.getByText('Normal')).not.toHaveClass('rounded-pill');
  });

  it('applies custom className', () => {
    render(<Badge className="custom">Badge</Badge>);
    expect(screen.getByText('Badge')).toHaveClass('badge', 'custom');
  });

  it('renders as span', () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText('Tag').tagName).toBe('SPAN');
  });

  it('has displayName', () => {
    expect(Badge.displayName).toBe('Badge');
  });

  describe('muted', () => {
    it('applies badge-muted when muted is true', () => {
      render(<Badge muted>Muted</Badge>);
      expect(screen.getByText('Muted')).toHaveClass('badge-muted');
    });

    it('does not apply badge-muted by default', () => {
      render(<Badge>Plain</Badge>);
      expect(screen.getByText('Plain')).not.toHaveClass('badge-muted');
    });
  });

  describe('outline', () => {
    it('applies badge-outline when outline is true', () => {
      render(<Badge outline>Outline</Badge>);
      expect(screen.getByText('Outline')).toHaveClass('badge-outline');
    });

    it('outline wins when both muted and outline are passed', () => {
      render(<Badge muted outline>Both</Badge>);
      const badge = screen.getByText('Both');
      expect(badge).toHaveClass('badge-outline');
      expect(badge).not.toHaveClass('badge-muted');
    });
  });

  describe('hue tokens', () => {
    const hues = [
      'blue', 'indigo', 'purple', 'pink', 'rose',
      'orange', 'amber', 'yellow',
      'green', 'emerald', 'teal', 'cyan',
      'slate', 'neutral',
    ] as const;

    it.each(hues)('applies bg-%s for the %s hue', (hue) => {
      render(<Badge bg={hue}>{hue}</Badge>);
      expect(screen.getByText(hue)).toHaveClass(`bg-${hue}`);
    });
  });

  describe('custom colour', () => {
    it('sets --badge-bg inline when colour is provided', () => {
      render(<Badge colour="#7c6cff">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge.style.getPropertyValue('--badge-bg')).toBe('#7c6cff');
    });

    it('does not apply a bg-* class when colour is provided', () => {
      render(<Badge bg="success" colour="#7c6cff">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge).not.toHaveClass('bg-success');
      expect(badge).not.toHaveClass('bg-primary');
    });

    it('sets --badge-fg inline when textColour is provided with colour', () => {
      render(<Badge colour="#ffffff" textColour="#000000">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge.style.getPropertyValue('--badge-fg')).toBe('#000000');
    });

    it('does not set --badge-fg when only textColour is provided', () => {
      render(<Badge textColour="#000">No colour</Badge>);
      const badge = screen.getByText('No colour');
      expect(badge.style.getPropertyValue('--badge-fg')).toBe('');
    });

    it('preserves caller-supplied style alongside colour', () => {
      render(<Badge colour="#abcdef" style={{ marginLeft: 8 }}>Styled</Badge>);
      const badge = screen.getByText('Styled');
      expect(badge.style.marginLeft).toBe('8px');
      expect(badge.style.getPropertyValue('--badge-bg')).toBe('#abcdef');
    });

    it('also applies inline color so textColour wins over muted/outline', () => {
      render(<Badge colour="#abcdef" textColour="#123456" muted>Muted</Badge>);
      const badge = screen.getByText('Muted');
      expect(badge.style.color).toBe('rgb(18, 52, 86)');
    });

    it('does not set inline color when textColour is not supplied', () => {
      render(<Badge colour="#abcdef">Just colour</Badge>);
      const badge = screen.getByText('Just colour');
      expect(badge.style.color).toBe('');
    });
  });

  describe('icon', () => {
    it('renders the icon node before children', () => {
      const { container } = render(
        <Badge icon={<svg data-testid="ic" />}>Label</Badge>
      );
      const badge = container.querySelector('.badge')!;
      expect(badge.firstChild).toBe(container.querySelector('[data-testid="ic"]'));
    });

    it('applies badge-with-icon class when icon present', () => {
      render(<Badge icon={<svg />}>Label</Badge>);
      expect(screen.getByText('Label')).toHaveClass('badge-with-icon');
    });

    it('omits badge-with-icon class when no icon', () => {
      render(<Badge>Label</Badge>);
      expect(screen.getByText('Label')).not.toHaveClass('badge-with-icon');
    });
  });
});
