import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Login } from '../Login';

// Mock MSAL authentication hook
const mockUseMsalAuthentication = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsalAuthentication: (interactionType: any, request: any) => {
    mockUseMsalAuthentication(interactionType, request);
    return {
      login: vi.fn(),
      result: null,
      error: null,
    };
  },
}));

vi.mock('@azure/msal-browser', () => ({
  InteractionType: {
    Redirect: 'redirect',
    Popup: 'popup',
    Silent: 'silent',
  },
}));

vi.mock('../msal', () => ({
  loginRequest: { scopes: ['openid', 'profile'] },
}));

describe('Login', () => {
  beforeEach(() => {
    mockUseMsalAuthentication.mockClear();
  });

  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Login>
          <div data-testid="child">Protected Content</div>
        </Login>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Login>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </Login>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });

    it('renders nested components', () => {
      render(
        <Login>
          <div>
            <span data-testid="nested">Nested Content</span>
          </div>
        </Login>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });
  });

  describe('authentication', () => {
    it('calls useMsalAuthentication with Redirect interaction type', () => {
      render(
        <Login>
          <div>Content</div>
        </Login>
      );

      expect(mockUseMsalAuthentication).toHaveBeenCalledWith(
        'redirect',
        expect.any(Object)
      );
    });

    it('passes loginRequest to useMsalAuthentication', () => {
      render(
        <Login>
          <div>Content</div>
        </Login>
      );

      expect(mockUseMsalAuthentication).toHaveBeenCalledWith(
        expect.anything(),
        { scopes: ['openid', 'profile'] }
      );
    });

    it('calls authentication hook on mount', () => {
      render(
        <Login>
          <div>Content</div>
        </Login>
      );

      expect(mockUseMsalAuthentication).toHaveBeenCalledTimes(1);
    });
  });

  describe('with different children types', () => {
    it('renders text children', () => {
      render(<Login>Plain text content</Login>);

      expect(screen.getByText('Plain text content')).toBeInTheDocument();
    });

    it('renders null children without error', () => {
      const { container } = render(<Login>{null}</Login>);

      expect(container).toBeInTheDocument();
    });

    it('renders fragment children', () => {
      render(
        <Login>
          <>
            <span data-testid="frag1">Fragment 1</span>
            <span data-testid="frag2">Fragment 2</span>
          </>
        </Login>
      );

      expect(screen.getByTestId('frag1')).toBeInTheDocument();
      expect(screen.getByTestId('frag2')).toBeInTheDocument();
    });
  });
});
