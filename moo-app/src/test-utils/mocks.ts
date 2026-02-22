import { vi } from 'vitest';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Creates a mock Axios instance with all common methods
 * Methods are vi.fn() mocks that can be configured per test
 */
export const createAxiosMock = (): AxiosInstance => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  head: vi.fn(),
  options: vi.fn(),
  request: vi.fn(),
  getUri: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn(),
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
      delete: {},
      get: {},
      head: {},
      post: {},
      put: {},
      patch: {},
    },
  },
} as unknown as AxiosInstance);

/**
 * Creates a mock successful Axios response
 * @param data - The response data
 * @param headers - Optional response headers
 * @param status - HTTP status code (default: 200)
 */
export const createAxiosResponse = <T>(
  data: T,
  headers: Record<string, string> = {},
  status = 200
): AxiosResponse<T> => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers,
  config: {
    headers: {},
  } as InternalAxiosRequestConfig,
});

/**
 * Creates a mock Axios error
 * @param message - Error message
 * @param status - HTTP status code
 * @param data - Optional error response data
 */
export const createAxiosError = (
  message: string,
  status = 500,
  data?: unknown
) => {
  const error = new Error(message) as any;
  error.isAxiosError = true;
  error.response = {
    status,
    statusText: message,
    data,
    headers: {},
    config: {},
  };
  return error;
};

/**
 * Mock MSAL account object
 */
export const mockMsalAccount = {
  homeAccountId: 'mock-home-account-id',
  localAccountId: 'mock-local-account-id',
  environment: 'login.microsoftonline.com',
  tenantId: 'mock-tenant-id',
  username: 'test@example.com',
  name: 'Test User',
};

/**
 * Creates a mock MSAL context for useMsal() hook
 */
export const createMsalContextMock = () => ({
  instance: {
    acquireTokenSilent: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      account: mockMsalAccount,
    }),
    acquireTokenPopup: vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      account: mockMsalAccount,
    }),
    acquireTokenRedirect: vi.fn().mockResolvedValue(undefined),
    loginRedirect: vi.fn().mockResolvedValue(undefined),
    loginPopup: vi.fn().mockResolvedValue({
      account: mockMsalAccount,
    }),
    logoutRedirect: vi.fn().mockResolvedValue(undefined),
    logoutPopup: vi.fn().mockResolvedValue(undefined),
    getActiveAccount: vi.fn().mockReturnValue(mockMsalAccount),
    setActiveAccount: vi.fn(),
    getAllAccounts: vi.fn().mockReturnValue([mockMsalAccount]),
    addEventCallback: vi.fn().mockReturnValue('callback-id'),
    removeEventCallback: vi.fn(),
    initialize: vi.fn().mockResolvedValue(undefined),
  },
  accounts: [mockMsalAccount],
  inProgress: 'none' as const,
});

/**
 * Creates a mock MSAL instance for MsalProvider
 */
export const createMsalInstanceMock = () => {
  const context = createMsalContextMock();
  return context.instance;
};

/**
 * Creates a mock for useIsAuthenticated() hook
 * @param isAuthenticated - Whether user is authenticated (default: true)
 */
export const createIsAuthenticatedMock = (isAuthenticated = true) =>
  vi.fn().mockReturnValue(isAuthenticated);

/**
 * Creates a mock QueryClient for React Query
 */
export const createQueryClientMock = () => ({
  clear: vi.fn(),
  cancelQueries: vi.fn(),
  invalidateQueries: vi.fn().mockResolvedValue(undefined),
  refetchQueries: vi.fn().mockResolvedValue(undefined),
  setQueryData: vi.fn(),
  getQueryData: vi.fn(),
  getQueryState: vi.fn(),
  removeQueries: vi.fn(),
  resetQueries: vi.fn(),
  isFetching: vi.fn().mockReturnValue(0),
  isMutating: vi.fn().mockReturnValue(0),
  getDefaultOptions: vi.fn().mockReturnValue({}),
  setDefaultOptions: vi.fn(),
  getQueryCache: vi.fn(),
  getMutationCache: vi.fn(),
  mount: vi.fn(),
  unmount: vi.fn(),
});

/**
 * Mock app configuration for AppProvider
 */
export const mockAppConfig = {
  name: 'Test App',
  version: '1.0.0',
  copyrightYear: 2024,
};

/**
 * Mock layout state for LayoutProvider
 */
export const mockLayoutState = {
  breadcrumbs: [] as any[],
  secondaryNav: [] as any[],
  actions: [] as any[],
  showSidebar: true,
  sidebarCollapsed: false,
  setBreadcrumbs: vi.fn(),
  setSecondaryNav: vi.fn(),
  setActions: vi.fn(),
  setShowSidebar: vi.fn(),
  toggleSidebar: vi.fn(),
  photo: undefined as string | undefined,
};
