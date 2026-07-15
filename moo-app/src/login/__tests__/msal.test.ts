import { describe, it, expect, vi } from 'vitest';

// Mock only the instance factory so getMsalInstance can be exercised without
// creating a real MSAL instance; everything else (LogLevel, enums) stays real.
vi.mock('@azure/msal-browser', async (importActual) => {
  const actual = await importActual<typeof import('@azure/msal-browser')>();
  return {
    ...actual,
    createStandardPublicClientApplication: vi.fn(async (config: any): Promise<any> => ({
      __config: config,
      addEventCallback: vi.fn(),
      getAllAccounts: (): any[] => [],
      getActiveAccount: (): any => null,
      setActiveAccount: vi.fn(),
    })),
  };
});

import getMsalInstance, { loginRequest, apiRequest } from '../msal';
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
