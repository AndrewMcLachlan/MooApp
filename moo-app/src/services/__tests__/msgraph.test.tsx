import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockGet = vi.fn();
const mockEject = vi.fn();

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: { getActiveAccount: () => ({ homeAccountId: 'test-account' }) },
    accounts: [{ homeAccountId: 'test-account' }],
  }),
}));

vi.mock('../../providers/HttpClientProvider', () => ({
  createHttpClient: () => ({
    interceptors: { request: { eject: mockEject } },
    get: mockGet,
  }),
  addMsalInterceptor: () => 1,
}));

import { usePhoto } from '../msgraph';

describe('usePhoto photo-fetch error handling', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let debugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockGet.mockReset();
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    debugSpy.mockRestore();
  });

  it('does not warn when the request is canceled (e.g. block_iframe_reload redirect handoff)', async () => {
    mockGet.mockRejectedValue({ code: 'ERR_CANCELED' });

    renderHook(() => usePhoto());

    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    // Give the rejected promise a tick to settle.
    await Promise.resolve();

    expect(warnSpy).not.toHaveBeenCalled();
    expect(debugSpy).not.toHaveBeenCalled();
  });

  it('logs at debug (not warn) when the user has no photo (404)', async () => {
    mockGet.mockRejectedValue({ response: { status: 404 } });

    renderHook(() => usePhoto());

    await waitFor(() => expect(debugSpy).toHaveBeenCalled());
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('warns on a genuine, unexpected error', async () => {
    mockGet.mockRejectedValue({ response: { status: 500 } });

    renderHook(() => usePhoto());

    await waitFor(() => expect(warnSpy).toHaveBeenCalled());
  });
});
