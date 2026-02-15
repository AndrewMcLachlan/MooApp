import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  describe('base Input', () => {
    it('renders an input element', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('applies form-control class', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('form-control');
    });

    it('applies form-check-input for checkbox type', () => {
      render(<Input type="checkbox" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('form-check-input');
    });

    it('applies form-check-input for radio type', () => {
      render(<Input type="radio" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('form-check-input');
    });

    it('applies custom className', () => {
      render(<Input className="custom" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('form-control', 'custom');
    });

    it('has displayName', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Input.Check', () => {
    it('renders a checkbox by default', () => {
      render(<Input.Check id="check" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders a radio when type="radio"', () => {
      render(<Input.Check id="radio" type="radio" />);
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input.Check id="check" label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('applies form-check wrapper class', () => {
      const { container } = render(<Input.Check id="check" />);
      expect(container.querySelector('.form-check')).toBeInTheDocument();
    });

    it('applies form-check-input class to input', () => {
      render(<Input.Check id="check" />);
      expect(screen.getByRole('checkbox')).toHaveClass('form-check-input');
    });

    it('applies inline class', () => {
      const { container } = render(<Input.Check id="check" inline />);
      expect(container.querySelector('.form-check-inline')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Input.Check.displayName).toBe('Input.Check');
    });
  });

  describe('Input.Switch', () => {
    it('renders a checkbox with switch role', () => {
      render(<Input.Switch id="switch" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input.Switch id="switch" label="Toggle" />);
      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('applies form-switch class', () => {
      const { container } = render(<Input.Switch id="switch" />);
      expect(container.querySelector('.form-switch')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(Input.Switch.displayName).toBe('Input.Switch');
    });
  });

  describe('Input.Select', () => {
    it('renders a select element', () => {
      render(
        <Input.Select data-testid="select">
          <option>One</option>
        </Input.Select>
      );
      expect(screen.getByTestId('select').tagName).toBe('SELECT');
    });

    it('applies form-select class', () => {
      render(
        <Input.Select data-testid="select">
          <option>One</option>
        </Input.Select>
      );
      expect(screen.getByTestId('select')).toHaveClass('form-select');
    });

    it('renders options', () => {
      render(
        <Input.Select data-testid="select">
          <option>First</option>
          <option>Second</option>
        </Input.Select>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Input.Select className="custom" data-testid="select">
          <option>One</option>
        </Input.Select>
      );
      expect(screen.getByTestId('select')).toHaveClass('form-select', 'custom');
    });

    it('has displayName', () => {
      expect(Input.Select.displayName).toBe('Input.Select');
    });
  });
});
