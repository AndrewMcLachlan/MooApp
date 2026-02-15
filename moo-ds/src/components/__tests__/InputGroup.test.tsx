import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InputGroup } from '../InputGroup';

describe('InputGroup', () => {
  it('renders children', () => {
    render(<InputGroup><input /></InputGroup>);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies input-group class', () => {
    render(<InputGroup data-testid="group"><input /></InputGroup>);
    expect(screen.getByTestId('group')).toHaveClass('input-group');
  });

  it('applies custom className', () => {
    render(<InputGroup className="custom" data-testid="group"><input /></InputGroup>);
    expect(screen.getByTestId('group')).toHaveClass('input-group', 'custom');
  });

  it('has displayName', () => {
    expect(InputGroup.displayName).toBe('InputGroup');
  });

  describe('InputGroup.Text', () => {
    it('renders children', () => {
      render(
        <InputGroup>
          <InputGroup.Text>@</InputGroup.Text>
          <input />
        </InputGroup>
      );
      expect(screen.getByText('@')).toBeInTheDocument();
    });

    it('applies input-group-text class', () => {
      render(
        <InputGroup>
          <InputGroup.Text>$</InputGroup.Text>
        </InputGroup>
      );
      expect(screen.getByText('$')).toHaveClass('input-group-text');
    });

    it('has displayName', () => {
      expect(InputGroup.Text.displayName).toBe('InputGroup.Text');
    });
  });
});
