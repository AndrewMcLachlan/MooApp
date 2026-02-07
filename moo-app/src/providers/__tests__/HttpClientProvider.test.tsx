import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import React from 'react';
import axios, { AxiosInstance } from 'axios';
import {
  HttpClientProvider,
  HttpClientContext,
  useHttpClient,
  createHttpClient,
  addMsalInterceptor,
} from '../HttpClientProvider';

// Mock MSAL
const mockAcquireTokenSilent = vi.fn();
const mockLoginRedirect = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: mockAcquireTokenSilent,
      loginRedirect: mockLoginRedirect,
    },
    accounts: [],
    inProgress: 'none',
  }),
}));

vi.mock('../login/msal', () => ({
  loginRequest: { scopes: ['openid', 'profile'] },
}));

describe('HttpClientProvider', () => {
  beforeEach(() => {
    mockAcquireTokenSilent.mockClear();
    mockLoginRedirect.mockClear();
  });

  describe('rendering', () => {
    it('renders children', () => {
      render(
        <HttpClientProvider baseUrl="https://api.example.com">
          <div data-testid="child">Content</div>
        </HttpClientProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('throws error when neither client nor baseUrl provided', () => {
      expect(() => {
        render(
          <HttpClientProvider>
            <div>Content</div>
          </HttpClientProvider>
        );
      }).toThrow('You must provide either a client or a baseUrl to HttpClientProvider');
    });
  });

  describe('with baseUrl', () => {
    it('creates http client from baseUrl', () => {
      render(
        <HttpClientProvider baseUrl="https://api.example.com">
          <div>Content</div>
        </HttpClientProvider>
      );

      // Component should render without error
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts scopes prop', () => {
      render(
        <HttpClientProvider baseUrl="https://api.example.com" scopes={['api://test']}>
          <div>Content</div>
        </HttpClientProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('with custom client', () => {
    it('uses provided client', () => {
      const customClient = axios.create({ baseURL: 'https://custom.api.com' });

      render(
        <HttpClientProvider client={customClient}>
          <div>Content</div>
        </HttpClientProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

describe('useHttpClient', () => {
  it('returns undefined outside provider', () => {
    const { result } = renderHook(() => useHttpClient());

    expect(result.current).toBeUndefined();
  });

  it('returns http client inside provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HttpClientProvider baseUrl="https://api.example.com">
        {children}
      </HttpClientProvider>
    );

    const { result } = renderHook(() => useHttpClient(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current?.defaults.baseURL).toBe('https://api.example.com');
  });
});

describe('createHttpClient', () => {
  it('creates axios instance with baseURL', () => {
    const client = createHttpClient('https://api.example.com');

    expect(client.defaults.baseURL).toBe('https://api.example.com');
  });

  it('sets Accept header to application/json', () => {
    const client = createHttpClient('https://api.example.com');

    expect(client.defaults.headers['Accept']).toBe('application/json');
  });

  it('returns AxiosInstance', () => {
    const client = createHttpClient('https://api.example.com');

    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
  });
});

describe('addMsalInterceptor', () => {
  it('adds request interceptor to client', () => {
    const client = axios.create();
    const originalCount = client.interceptors.request.handlers.length;

    const msal = {
      instance: {
        acquireTokenSilent: mockAcquireTokenSilent,
        loginRedirect: mockLoginRedirect,
      },
      accounts: [],
      inProgress: 'none' as const,
    } as any;

    addMsalInterceptor(client, msal, ['api://test']);

    expect(client.interceptors.request.handlers.length).toBe(originalCount + 1);
  });
});
