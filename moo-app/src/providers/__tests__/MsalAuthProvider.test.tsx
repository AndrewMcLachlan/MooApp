import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { AuthError } from '@azure/msal-browser';
import { MsalAuthProvider, addMsalInterceptor, isAuthCancellation } from '../MsalAuthProvider';

// Mock MSAL react context for the component test
const mockAcquireTokenSilent = vi.fn();
const mockAddEventCallback = vi.fn().mockReturnValue('callback-id');
const mockRemoveEventCallback = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: mockAcquireTokenSilent,
      acquireTokenRedirect: vi.fn(),
      addEventCallback: mockAddEventCallback,
      removeEventCallback: mockRemoveEventCallback,
      getActiveAccount: vi.fn().mockReturnValue(null),
      getAllAccounts: vi.fn().mockReturnValue([]),
    },
    accounts: [] as any[],
    inProgress: 'none',
  }),
}));

const { mockGetSilentRedirectUri } = vi.hoisted(() => ({
  mockGetSilentRedirectUri: vi.fn<() => string | undefined>(() => undefined),
}));

vi.mock('../../login/msal', () => ({
  loginRequest: { scopes: ['openid', 'profile'] },
  getSilentRedirectUri: mockGetSilentRedirectUri,
}));

describe('MsalAuthProvider', () => {
  beforeEach(() => {
    mockAcquireTokenSilent.mockClear();
    mockAddEventCallback.mockClear();
    mockRemoveEventCallback.mockClear();
  });

  it('renders its children', () => {
    const client = axios.create();
    render(
      <MsalAuthProvider client={client}>
        <div data-testid="child">Content</div>
      </MsalAuthProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('attaches a request interceptor to the provided client', () => {
    const client = axios.create();
    const before = client.interceptors.request.handlers.length;

    render(
      <MsalAuthProvider client={client} scopes={['api://test']}>
        <div>Content</div>
      </MsalAuthProvider>
    );

    expect(client.interceptors.request.handlers.length).toBe(before + 1);
  });

  it('registers an MSAL event callback while mounted and removes it on unmount', () => {
    const client = axios.create();
    const { unmount } = render(
      <MsalAuthProvider client={client}>
        <div>Content</div>
      </MsalAuthProvider>
    );

    expect(mockAddEventCallback).toHaveBeenCalled();

    unmount();

    expect(mockRemoveEventCallback).toHaveBeenCalledWith('callback-id');
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

  beforeEach(() => {
    mockGetSilentRedirectUri.mockReturnValue(undefined);
  });

  it('adds a request interceptor to the client', () => {
    const client = axios.create();
    const originalCount = client.interceptors.request.handlers.length;

    addMsalInterceptor(client, createMockMsal(), ['api://test']);

    expect(client.interceptors.request.handlers.length).toBe(originalCount + 1);
  });

  it('sets the Authorization header on successful silent token acquisition', async () => {
    const msal = createMockMsal({
      acquireTokenSilent: vi.fn().mockResolvedValue({ accessToken: 'test-token-123' }),
    });
    const client = createClientWithInterceptor(msal);

    const response = await client.get('/api/data');

    expect(response.config.headers.getAuthorization()).toBe('Bearer test-token-123');
  });

  it('passes the configured silent redirect URI to acquireTokenSilent', async () => {
    const acquireTokenSilent = vi.fn().mockResolvedValue({ accessToken: 'test-token-123' });
    const msal = createMockMsal({ acquireTokenSilent });
    mockGetSilentRedirectUri.mockReturnValue('https://app.example.com/blank.html');
    const client = createClientWithInterceptor(msal);

    await client.get('/api/data');

    expect(acquireTokenSilent).toHaveBeenCalledWith(
      expect.objectContaining({ redirectUri: 'https://app.example.com/blank.html' })
    );
  });

  it('omits redirectUri from the silent request when none is configured', async () => {
    const acquireTokenSilent = vi.fn().mockResolvedValue({ accessToken: 'test-token-123' });
    const msal = createMockMsal({ acquireTokenSilent });
    mockGetSilentRedirectUri.mockReturnValue(undefined);
    const client = createClientWithInterceptor(msal);

    await client.get('/api/data');

    expect(acquireTokenSilent.mock.calls[0][0]).not.toHaveProperty('redirectUri');
  });

  it('does not set the Authorization header when acquireTokenSilent returns no accessToken', async () => {
    const msal = createMockMsal({
      acquireTokenSilent: vi.fn().mockResolvedValue({ accessToken: null }),
    });
    const client = createClientWithInterceptor(msal);

    const response = await client.get('/api/data');

    expect(response.config.headers.getAuthorization()).toBeUndefined();
  });

  describe('no_account_error handling', () => {
    it('cancels the request when acquireTokenSilent throws no_account_error', async () => {
      const error = new AuthError('no_account_error', 'No account');
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
        acquireTokenRedirect: vi.fn().mockResolvedValue(null),
      });
      const client = createClientWithInterceptor(msal);

      await expect(client.get('/api/data')).rejects.toThrow('Request canceled');
    });

    it('triggers acquireTokenRedirect when inProgress is None', async () => {
      const error = new AuthError('no_account_error', 'No account');
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
      const error = new AuthError('no_account_error', 'No account');
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

  describe('other recoverable auth errors', () => {
    it.each([
      'invalid_grant',
      'interaction_required',
      'login_required',
      'consent_required',
    ])('cancels the request for %s error', async (errorCode) => {
      const error = new AuthError(errorCode, errorCode);
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
        acquireTokenRedirect: vi.fn().mockResolvedValue(null),
      });
      const client = createClientWithInterceptor(msal);

      await expect(client.get('/api/data')).rejects.toThrow('Request canceled');
    });
  });

  describe('non-recoverable errors', () => {
    it('cancels the request for unknown errors instead of sending without auth', async () => {
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

  describe('auth cancellation marker', () => {
    it('marks interceptor cancellations so callers can identify them', async () => {
      const error = new AuthError('interaction_required', 'interaction_required');
      const msal = createMockMsal({
        acquireTokenSilent: vi.fn().mockRejectedValue(error),
        acquireTokenRedirect: vi.fn().mockResolvedValue(null),
      });
      const client = createClientWithInterceptor(msal);

      const rejection = await client.get('/api/data').then(
        () => { throw new Error('expected rejection'); },
        (e) => e,
      );

      expect(isAuthCancellation(rejection)).toBe(true);
    });

    it('does not identify ordinary errors as auth cancellations', () => {
      expect(isAuthCancellation(new Error('boom'))).toBe(false);
      expect(isAuthCancellation(new axios.CanceledError('user canceled'))).toBe(false);
      expect(isAuthCancellation(undefined)).toBe(false);
    });
  });
});

describe('401 response recovery', () => {
  const createMockMsal = (overrides: Record<string, any> = {}) => ({
    instance: {
      acquireTokenSilent: vi.fn(),
      acquireTokenRedirect: vi.fn(),
      getActiveAccount: vi.fn().mockReturnValue({ homeAccountId: 'acct' }),
      getAllAccounts: vi.fn().mockReturnValue([{ homeAccountId: 'acct' }]),
      ...overrides,
    },
    accounts: [],
    inProgress: 'none',
  } as any);

  /**
   * Adapter that answers each request with the next status in the queue
   * (repeating the last one), so a 401-then-200 sequence can be scripted.
   */
  const createClientWithStatusQueue = (msal: any, statuses: number[], scopes: string[] = ['api://test']) => {
    const client = axios.create();
    const calls: { auth: string | undefined }[] = [];
    client.defaults.adapter = async (config) => {
      const status = statuses.length > 1 ? statuses.shift()! : statuses[0];
      calls.push({ auth: config.headers.Authorization as string | undefined });
      const response = { data: {}, status, statusText: String(status), headers: {}, config } as any;
      if (status >= 400) {
        throw new axios.AxiosError(`Request failed with status code ${status}`, String(status), config as any, {}, response);
      }
      return response;
    };
    addMsalInterceptor(client, msal, scopes);
    return { client, calls };
  };

  beforeEach(() => {
    mockGetSilentRedirectUri.mockReturnValue(undefined);
  });

  it('force-refreshes the token and retries once on 401', async () => {
    const acquireTokenSilent = vi.fn()
      .mockResolvedValueOnce({ accessToken: 'stale-token' })   // request interceptor (initial)
      .mockResolvedValueOnce({ accessToken: 'fresh-token' })   // force refresh
      .mockResolvedValue({ accessToken: 'fresh-token' });      // request interceptor (retry)
    const msal = createMockMsal({ acquireTokenSilent });
    const { client, calls } = createClientWithStatusQueue(msal, [401, 200]);

    const response = await client.get('/api/data');

    expect(response.status).toBe(200);
    expect(acquireTokenSilent).toHaveBeenCalledWith(expect.objectContaining({ forceRefresh: true }));
    expect(calls).toHaveLength(2);
    expect(calls[1].auth).toBe('Bearer fresh-token');
  });

  it('does not retry a second time when the retried request also 401s', async () => {
    const acquireTokenSilent = vi.fn().mockResolvedValue({ accessToken: 'token' });
    const msal = createMockMsal({ acquireTokenSilent });
    const { client, calls } = createClientWithStatusQueue(msal, [401]);

    const rejection = await client.get('/api/data').then(
      () => { throw new Error('expected rejection'); },
      (e) => e,
    );

    expect(rejection.response?.status).toBe(401);
    expect(calls).toHaveLength(2); // original + exactly one retry
    const forceRefreshCalls = acquireTokenSilent.mock.calls.filter(([req]) => req?.forceRefresh);
    expect(forceRefreshCalls).toHaveLength(1);
  });

  it('shares a single force-refresh across concurrent 401s', async () => {
    let resolveRefresh: (v: any) => void;
    const refreshPromise = new Promise((resolve) => { resolveRefresh = resolve; });
    const acquireTokenSilent = vi.fn().mockImplementation((req) =>
      req?.forceRefresh ? refreshPromise : Promise.resolve({ accessToken: 'stale-token' }));
    const msal = createMockMsal({ acquireTokenSilent });
    const { client } = createClientWithStatusQueue(msal, [401, 401, 200]);

    // Settle rejections inline so neither can surface as unhandled while the
    // refresh is deliberately held open.
    const first = client.get('/api/one').catch((e) => e);
    const second = client.get('/api/two').catch((e) => e);
    // Let both requests 401 and enter the refresh path before resolving it.
    await new Promise((r) => setTimeout(r, 10));
    resolveRefresh!({ accessToken: 'fresh-token' });
    await Promise.all([first, second]);

    const forceRefreshCalls = acquireTokenSilent.mock.calls.filter(([req]) => req?.forceRefresh);
    expect(forceRefreshCalls).toHaveLength(1);
  });

  it('falls back to the guarded redirect when the force refresh needs interaction', async () => {
    const acquireTokenRedirect = vi.fn().mockResolvedValue(null);
    const acquireTokenSilent = vi.fn().mockImplementation((req) =>
      req?.forceRefresh
        ? Promise.reject(new AuthError('interaction_required', 'interaction_required'))
        : Promise.resolve({ accessToken: 'stale-token' }));
    const msal = createMockMsal({ acquireTokenSilent, acquireTokenRedirect });
    const { client } = createClientWithStatusQueue(msal, [401]);

    const rejection = await client.get('/api/data').then(
      () => { throw new Error('expected rejection'); },
      (e) => e,
    );

    expect(acquireTokenRedirect).toHaveBeenCalledTimes(1);
    expect(isAuthCancellation(rejection)).toBe(true);
  });

  it('does not redirect when the force refresh fails with a network error', async () => {
    const acquireTokenRedirect = vi.fn();
    const acquireTokenSilent = vi.fn().mockImplementation((req) =>
      req?.forceRefresh
        ? Promise.reject(new AuthError('network_error', 'network_error'))
        : Promise.resolve({ accessToken: 'stale-token' }));
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const msal = createMockMsal({ acquireTokenSilent, acquireTokenRedirect });
    const { client } = createClientWithStatusQueue(msal, [401]);

    const rejection = await client.get('/api/data').then(
      () => { throw new Error('expected rejection'); },
      (e) => e,
    );

    expect(acquireTokenRedirect).not.toHaveBeenCalled();
    expect(isAuthCancellation(rejection)).toBe(true);
    consoleSpy.mockRestore();
  });

  it('passes non-401 response errors through untouched', async () => {
    const acquireTokenSilent = vi.fn().mockResolvedValue({ accessToken: 'token' });
    const msal = createMockMsal({ acquireTokenSilent });
    const { client, calls } = createClientWithStatusQueue(msal, [500]);

    const rejection = await client.get('/api/data').then(
      () => { throw new Error('expected rejection'); },
      (e) => e,
    );

    expect(rejection.response?.status).toBe(500);
    expect(calls).toHaveLength(1); // no retry
    const forceRefreshCalls = acquireTokenSilent.mock.calls.filter(([req]) => req?.forceRefresh);
    expect(forceRefreshCalls).toHaveLength(0);
  });
});
