import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { NavItemDivider } from '../NavItemDivider';

describe('NavItemDivider', () => {
  describe('rendering', () => {
    it('renders nav item', () => {
      const { container } = render(<NavItemDivider />);

      expect(container.querySelector('.nav-item')).toBeInTheDocument();
    });

    it('applies divider class', () => {
      const { container } = render(<NavItemDivider />);

      expect(container.querySelector('.divider')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(NavItemDivider.displayName).toBe('NavItemDivider');
    });
  });
});
