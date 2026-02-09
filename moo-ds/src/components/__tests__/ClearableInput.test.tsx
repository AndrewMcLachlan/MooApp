import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClearableInput } from '../ClearableInput';

describe('ClearableInput', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      render(<ClearableInput />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders without clear button when clearable is false', () => {
      const { container } = render(<ClearableInput clearable={false} />);

      expect(container.querySelector('.clearable')).not.toBeInTheDocument();
      expect(container.querySelector('.clear-input')).not.toBeInTheDocument();
    });

    it('renders with clear button when clearable is true', () => {
      const { container } = render(<ClearableInput clearable />);

      expect(container.querySelector('.clearable')).toBeInTheDocument();
      expect(container.querySelector('.clear-input')).toBeInTheDocument();
    });

    it('wraps input in clearable div when clearable', () => {
      const { container } = render(<ClearableInput clearable />);

      expect(container.querySelector('.clearable-input')).toBeInTheDocument();
    });
  });

  describe('input props', () => {
    it('passes props to input', () => {
      render(<ClearableInput placeholder="Enter text" />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('accepts value prop', () => {
      render(<ClearableInput value="test value" onChange={() => {}} />);

      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('accepts type prop', () => {
      render(<ClearableInput type="email" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('accepts className prop', () => {
      render(<ClearableInput className="custom-input" />);

      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });
  });

  describe('clear functionality', () => {
    it('clears input when clear button is clicked', () => {
      const onChange = vi.fn();
      const { container } = render(
        <ClearableInput clearable defaultValue="test" onChange={onChange} />
      );

      const clearButton = container.querySelector('.clear-input')!;
      fireEvent.click(clearButton);

      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('dispatches input event when cleared', () => {
      const { container } = render(<ClearableInput clearable defaultValue="test" />);
      const input = screen.getByRole('textbox');
      const inputHandler = vi.fn();
      input.addEventListener('input', inputHandler);

      const clearButton = container.querySelector('.clear-input')!;
      fireEvent.click(clearButton);

      expect(inputHandler).toHaveBeenCalled();
    });
  });

  describe('clear button accessibility', () => {
    it('has aria-hidden on clear button', () => {
      const { container } = render(<ClearableInput clearable />);

      const svg = container.querySelector('.clear-input');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('is focusable false', () => {
      const { container } = render(<ClearableInput clearable />);

      const svg = container.querySelector('.clear-input');
      expect(svg).toHaveAttribute('focusable', 'false');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(ClearableInput.displayName).toBe('ClearableInput');
    });
  });
});
