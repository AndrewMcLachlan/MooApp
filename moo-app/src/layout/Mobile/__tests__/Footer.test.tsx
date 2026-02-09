import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Mobile Footer', () => {
  describe('rendering', () => {
    it('renders footer element', () => {
      const { container } = render(<Footer copyrightYear={2024} />);

      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('is empty (no content)', () => {
      const { container } = render(<Footer copyrightYear={2024} />);

      expect(container.querySelector('footer')?.textContent).toBe('');
    });
  });

  describe('responsive visibility', () => {
    it('has d-lg-none class for mobile-only display', () => {
      const { container } = render(<Footer copyrightYear={2024} />);

      expect(container.querySelector('footer')).toHaveClass('d-lg-none');
    });
  });

  describe('props', () => {
    it('accepts copyrightYear prop (even if not used)', () => {
      // Mobile footer accepts the prop for interface consistency
      const { container } = render(<Footer copyrightYear={2024} />);

      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });
});
