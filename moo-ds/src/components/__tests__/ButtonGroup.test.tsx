import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonGroup } from '../ButtonGroup';

describe('ButtonGroup', () => {
  it('renders children', () => {
    render(<ButtonGroup><button>One</button></ButtonGroup>);
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('applies btn-group class', () => {
    render(<ButtonGroup data-testid="group"><button>One</button></ButtonGroup>);
    expect(screen.getByTestId('group')).toHaveClass('btn-group');
  });

  it('defaults to group role', () => {
    render(<ButtonGroup data-testid="group"><button>One</button></ButtonGroup>);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ButtonGroup className="custom" data-testid="group"><button>One</button></ButtonGroup>);
    expect(screen.getByTestId('group')).toHaveClass('btn-group', 'custom');
  });

  it('has displayName', () => {
    expect(ButtonGroup.displayName).toBe('ButtonGroup');
  });
});
