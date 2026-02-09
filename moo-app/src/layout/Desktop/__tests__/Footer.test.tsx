import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import { Footer } from '../Footer';

describe('Desktop Footer', () => {
  describe('rendering', () => {
    it('renders footer element', () => {
      const { container } = render(<Footer copyrightYear={2024} />);

      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('renders copyright text', () => {
      render(<Footer copyrightYear={2024} />);

      expect(screen.getByText(/Copyright.*Andrew McLachlan 2024/)).toBeInTheDocument();
    });

    it('renders app name and version', () => {
      render(<Footer copyrightYear={2024} />);

      // App name and version come from AppProvider context
      expect(screen.getByText(/Test App/)).toBeInTheDocument();
    });

    it('renders website link', () => {
      render(<Footer copyrightYear={2024} />);

      const link = screen.getByRole('link', { name: /andrewmclachlan\.com/ });
      expect(link).toHaveAttribute('href', 'http://www.andrewmclachlan.com');
    });
  });

  describe('responsive visibility', () => {
    it('has d-none d-lg-flex classes for responsive display', () => {
      const { container } = render(<Footer copyrightYear={2024} />);

      expect(container.querySelector('footer')).toHaveClass('d-none');
      expect(container.querySelector('footer')).toHaveClass('d-lg-flex');
    });
  });

  describe('copyright year', () => {
    it('displays the provided copyright year', () => {
      render(<Footer copyrightYear={2020} />);

      expect(screen.getByText(/2020/)).toBeInTheDocument();
    });

    it('displays different copyright years', () => {
      render(<Footer copyrightYear={2025} />);

      expect(screen.getByText(/2025/)).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('renders inside a Container', () => {
      const { container } = render(<Footer copyrightYear={2024} />);

      expect(container.querySelector('.container')).toBeInTheDocument();
    });
  });
});
