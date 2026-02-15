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
const mockAddEventCallback = vi.fn().mockReturnValue('callback-id');
const mockRemoveEventCallback = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: mockAcquireTokenSilent,
      loginRedirect: mockLoginRedirect,
      addEventCallback: mockAddEventCallback,
      removeEventCallback: mockRemoveEventCallback,
      getActiveAccount: vi.fn().mockReturnValue(null),
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
    mockAddEventCallback.mockClear();
    mockRemoveEventCallback.mockClear();
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
  const createMockMsal = (overrides: Record<string, any> = {}) => ({
    instance: {
      acquireTokenSilent: vi.fn(),
      acquireTokenRedirect: vi.fn(),
      getActiveAccount: vi.fn().mockReturnValue(null),
      getAllAccounts: vi.fn().mockReturnValue([]),
      ...overrides,
    },
    accounts: [],
    inProgress: 'none',
  } as any);

  const createClientWithInterceptor = (msal: any, scopes: string[] = ['api://test']) => {
    const client = axios.create();
    client.defaults.adapter = async (config) => ({ data: {}, status: 200, statusText: 'OK', headers: {}, config } as any);
    addMsalInterceptor(client, msal, scopes);
    return client;
  };

  it('adds request interceptor to client', () => {
    const client = axios.create();
    const originalCount = client.interceptors.request.handlers.length;

    const msal = createMockMsal();
    addMsalInterceptor(client, msal, ['api://test']);

    expect(client.interceptors.request.handlers.length).toBe(originalCount + 1);
  });

  it('sets Authorization header on successful silent token acquisition', async () => {
    const msal = createMockMsal({
      acquireTokenSilent: vi.fn().mockResolvedValue({ accessToken: 'test-token-123' }),
    });
    const client = createClientWithInterceptor(msal);

    const response = await client.get('/api/data');

    expect(response.config.headers.getAuthorization()).toBe('Bearer test-token-123');
  });

  it('does not set Authorization header when acquireTokenSilent returns no accessToken', async () => {
    const msal = createMockMsal({
      acquireTokenSilent: vi.fn().mockResolvedValue({ accessToken: null }),
    });
    const client = createClientWithInterceptor(msal);

    const response = await client.get('/api/data');

    expect(response.config.headers.getAuthorization()).toBeUndefined();
  });

  describe('no_account_error handling', () => {
    it('cancels request when acquireTokenSilent throws no_account_error', async () => {
      const error = Object.assign(new Error('No account'), { errorCode: 'no_account_error' });
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
        acquireTokenRedirect: vi.fn().mockResolvedValue(null),
      });
      const client = createClientWithInterceptor(msal);

      await expect(client.get('/api/data')).rejects.toThrow('Request canceled');
    });

    it('triggers acquireTokenRedirect when inProgress is None', async () => {
      const error = Object.assign(new Error('No account'), { errorCode: 'no_account_error' });
      const mockRedirect = vi.fn().mockResolvedValue(null);
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
        acquireTokenRedirect: mockRedirect,
      });
      msal.inProgress = 'none';
      const client = createClientWithInterceptor(msal);

      await expect(client.get('/api/data')).rejects.toThrow();

      expect(mockRedirect).toHaveBeenCalledTimes(1);
    });

    it('does not trigger acquireTokenRedirect when inProgress is Startup', async () => {
      const error = Object.assign(new Error('No account'), { errorCode: 'no_account_error' });
      const mockRedirect = vi.fn().mockResolvedValue(null);
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
        acquireTokenRedirect: mockRedirect,
      });
      msal.inProgress = 'startup';
      const client = createClientWithInterceptor(msal);

      await expect(client.get('/api/data')).rejects.toThrow('Request canceled');

      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe('other shouldRedirect errors', () => {
    it.each([
      'invalid_grant',
      'interaction_required',
      'login_required',
      'consent_required',
    ])('cancels request for %s error', async (errorCode) => {
      const error = Object.assign(new Error(errorCode), { errorCode });
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
        acquireTokenRedirect: vi.fn().mockResolvedValue(null),
      });
      const client = createClientWithInterceptor(msal);

      await expect(client.get('/api/data')).rejects.toThrow('Request canceled');
    });
  });

  describe('non-redirect errors', () => {
    it('cancels request for unknown errors instead of sending without auth', async () => {
      const error = Object.assign(new Error('Unknown'), { errorCode: 'some_other_error' });
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
      });
      const client = createClientWithInterceptor(msal);

      await expect(client.get('/api/data')).rejects.toThrow('Request canceled');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
