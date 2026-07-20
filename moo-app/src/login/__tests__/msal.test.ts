import { describe, it, expect, vi } from 'vitest';

// Shared holder so the hoisted mock can hand the registered MSAL event callback
// back to the test body (getMsalInstance registers it once, on the singleton).
const eventCallback = vi.hoisted(() => ({ current: undefined as ((event: any) => void) | undefined }));

// Mock only the instance factory so getMsalInstance can be exercised without
// creating a real MSAL instance; everything else (LogLevel, enums) stays real.
vi.mock('@azure/msal-browser', async (importActual) => {
  const actual = await importActual<typeof import('@azure/msal-browser')>();
  return {
    ...actual,
    createStandardPublicClientApplication: vi.fn(async (config: any): Promise<any> => ({
      __config: config,
      addEventCallback: vi.fn((cb: (event: any) => void) => { eventCallback.current = cb; return 'callback-id'; }),
      getAllAccounts: (): any[] => [],
      getActiveAccount: (): any => null,
      setActiveAccount: vi.fn(),
    })),
  };
});

import getMsalInstance, { AUTH_RECOVERED_EVENT, loginRequest, apiRequest } from '../msal';
import * as msalBrowser from '@azure/msal-browser';

describe('getMsalInstance configuration', () => {
  it('applies clientId and a custom authority to the MSAL config', async () => {
    await getMsalInstance('client-abc', {
      authority: 'https://login.microsoftonline.com/custom-tenant',
    });

    const createFn = msalBrowser.createStandardPublicClientApplication as unknown as ReturnType<typeof vi.fn>;
    expect(createFn).toHaveBeenCalled();

    const config = createFn.mock.calls[0][0] as any;
    expect(config.auth.clientId).toBe('client-abc');
    expect(config.auth.authority).toBe('https://login.microsoftonline.com/custom-tenant');
  });
});

describe('auth-recovered event', () => {
  // Fire an event through the callback getMsalInstance registered on the instance.
  const fire = async (event: any) => {
    await getMsalInstance('client-abc');
    expect(eventCallback.current).toBeDefined();
    eventCallback.current!(event);
  };

  it('dispatches AUTH_RECOVERED_EVENT on a silent ACQUIRE_TOKEN_SUCCESS', async () => {
    const listener = vi.fn();
    window.addEventListener(AUTH_RECOVERED_EVENT, listener);
    try {
      await fire({
        eventType: msalBrowser.EventType.ACQUIRE_TOKEN_SUCCESS,
        interactionType: msalBrowser.InteractionType.Silent,
        payload: { account: { homeAccountId: 'a' } },
      });
      expect(listener).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener(AUTH_RECOVERED_EVENT, listener);
    }
  });

  it('dispatches AUTH_RECOVERED_EVENT on a redirect ACQUIRE_TOKEN_SUCCESS', async () => {
    const listener = vi.fn();
    window.addEventListener(AUTH_RECOVERED_EVENT, listener);
    try {
      await fire({
        eventType: msalBrowser.EventType.ACQUIRE_TOKEN_SUCCESS,
        interactionType: msalBrowser.InteractionType.Redirect,
        payload: { account: { homeAccountId: 'a' } },
      });
      expect(listener).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener(AUTH_RECOVERED_EVENT, listener);
    }
  });
});

describe('msal configuration', () => {
  describe('loginRequest', () => {
    it('is defined', () => {
      expect(loginRequest).toBeDefined();
    });

    it('has scopes array', () => {
      expect(loginRequest.scopes).toBeDefined();
      expect(Array.isArray(loginRequest.scopes)).toBe(true);
    });

    it('includes openid scope', () => {
      expect(loginRequest.scopes).toContain('openid');
    });

    it('includes profile scope', () => {
      expect(loginRequest.scopes).toContain('profile');
    });

    it('has exactly 2 scopes', () => {
      expect(loginRequest.scopes).toHaveLength(2);
    });
  });

  describe('apiRequest', () => {
    it('is defined', () => {
      expect(apiRequest).toBeDefined();
    });

    it('has scopes array', () => {
      expect(apiRequest.scopes).toBeDefined();
      expect(Array.isArray(apiRequest.scopes)).toBe(true);
    });

    it('has empty scopes by default', () => {
      expect(apiRequest.scopes).toHaveLength(0);
    });
  });
});
