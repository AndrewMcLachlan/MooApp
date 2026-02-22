import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SpinnerContainer } from '../SpinnerContainer';

describe('SpinnerContainer', () => {
  describe('rendering', () => {
    it('renders spinner', () => {
      const { container } = render(<SpinnerContainer />);

      expect(container.querySelector('.spinner-border')).toBeInTheDocument();
    });

    it('renders with spinner-container class', () => {
      const { container } = render(<SpinnerContainer />);

      expect(container.querySelector('.spinner-container')).toBeInTheDocument();
    });

    it('renders border animation spinner', () => {
      const { container } = render(<SpinnerContainer />);

      expect(container.querySelector('.spinner-border')).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('wraps spinner in container div', () => {
      const { container } = render(<SpinnerContainer />);

      const containerDiv = container.querySelector('.spinner-container');
      expect(containerDiv?.querySelector('.spinner-border')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(SpinnerContainer.displayName).toBe('SpinnerContainer');
    });
  });
});
