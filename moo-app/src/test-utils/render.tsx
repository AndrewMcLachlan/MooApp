import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MsalProvider } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { AppProvider } from '../providers/AppProvider';
import { HttpClientContext } from '../providers/HttpClientProvider';
import { ThemeProvider, MessageProvider, LinkProvider, LinkComponent, NavLinkComponent } from '@andrewmclachlan/moo-ds';
import { createAxiosMock, mockAppConfig, mockMsalAccount } from './mocks';

/**
 * Mock Link component for testing
 */
const MockLink: LinkComponent = ({ to, href, children, className, ...props }) => (
  <a href={to ?? href} className={className as string} {...props}>
    {children}
  </a>
);

/**
 * Mock NavLink component for testing
 */
const MockNavLink: NavLinkComponent = ({ to, href, children, className, ...props }) => {
  const resolvedClassName = typeof className === 'function' ? className({ isActive: false }) : className;
  return (
    <a href={to ?? href} className={resolvedClassName} {...props}>
      {children}
    </a>
  );
};

/**
 * Creates a mock MSAL PublicClientApplication instance
 */
const createMockMsalInstance = (): IPublicClientApplication => ({
  initialize: () => Promise.resolve(),
  acquireTokenSilent: () => Promise.resolve({
    accessToken: 'mock-access-token',
    account: mockMsalAccount,
    authority: 'https://login.microsoftonline.com/common',
    uniqueId: 'mock-unique-id',
    tenantId: 'mock-tenant-id',
    scopes: ['openid', 'profile'],
    idToken: 'mock-id-token',
    idTokenClaims: {},
    fromCache: true,
    expiresOn: new Date(Date.now() + 3600000),
    tokenType: 'Bearer',
    correlationId: 'mock-correlation-id',
  }),
  acquireTokenPopup: () => Promise.resolve({} as any),
  acquireTokenRedirect: () => Promise.resolve(),
  acquireTokenByCode: () => Promise.resolve({} as any),
  addEventCallback: () => 'callback-id',
  removeEventCallback: () => {},
  addPerformanceCallback: () => 'perf-callback-id',
  removePerformanceCallback: () => false,
  enableAccountStorageEvents: () => {},
  disableAccountStorageEvents: () => {},
  getAccount: () => mockMsalAccount as any,
  getAccountByHomeId: () => mockMsalAccount as any,
  getAccountByLocalId: () => mockMsalAccount as any,
  getAccountByUsername: () => mockMsalAccount as any,
  getAllAccounts: () => [mockMsalAccount as any],
  handleRedirectPromise: () => Promise.resolve(null),
  loginPopup: () => Promise.resolve({} as any),
  loginRedirect: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  logoutRedirect: () => Promise.resolve(),
  logoutPopup: () => Promise.resolve(),
  ssoSilent: () => Promise.resolve({} as any),
  getTokenCache: () => ({} as any),
  getLogger: () => ({
    clone: () => ({
      error: () => {},
      warning: () => {},
      info: () => {},
      verbose: () => {},
      trace: () => {},
    }),
    error: () => {},
    warning: () => {},
    info: () => {},
    verbose: () => {},
    trace: () => {},
  } as any),
  setLogger: () => {},
  setActiveAccount: () => {},
  getActiveAccount: () => mockMsalAccount as any,
  initializeWrapperLibrary: () => {},
  setNavigationClient: () => {},
  getConfiguration: () => ({} as any),
  hydrateCache: () => Promise.resolve(),
  clearCache: () => Promise.resolve(),
} as unknown as IPublicClientApplication);

/**
 * Creates a test QueryClient with sensible defaults for testing
 * - Disables retries to make tests deterministic
 * - Disables refetch on window focus
 */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface WrapperProps {
  children: React.ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom QueryClient instance
   */
  queryClient?: QueryClient;
  /**
   * Custom Axios mock instance
   */
  httpClient?: ReturnType<typeof createAxiosMock>;
}

/**
 * Creates wrapper component with all providers
 */
const createWrapper = (options: CustomRenderOptions = {}) => {
  const {
    queryClient = createTestQueryClient(),
    httpClient = createAxiosMock(),
  } = options;

  const msalInstance = createMockMsalInstance();

  const Wrapper = ({ children }: WrapperProps) => (
    <MsalProvider instance={msalInstance}>
      <AppProvider {...mockAppConfig}>
        <HttpClientContext.Provider value={httpClient}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <MessageProvider>
                <LinkProvider LinkComponent={MockLink} NavLinkComponent={MockNavLink}>
                  {children}
                </LinkProvider>
              </MessageProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </HttpClientContext.Provider>
      </AppProvider>
    </MsalProvider>
  );

  return Wrapper;
};

/**
 * Custom render function that wraps components with all moo-app providers
 * Use this instead of @testing-library/react render for component tests
 *
 * @example
 * ```tsx
 * import { render, screen } from '../test-utils';
 *
 * it('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 *
 * @example
 * ```tsx
 * // With custom options
 * const httpClient = createAxiosMock();
 * httpClient.get.mockResolvedValue(createAxiosResponse({ data: 'test' }));
 *
 * render(<MyComponent />, { httpClient });
 * ```
 */
const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, httpClient, ...renderOptions } = options;
  return render(ui, {
    wrapper: createWrapper({ queryClient, httpClient }),
    ...renderOptions,
  });
};

/**
 * Renders a component with only QueryClient provider
 * Useful for testing hooks that use React Query
 */
export const renderWithQuery = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
};

/**
 * Renders a component with HttpClientProvider
 * Useful for testing components that use useHttpClient
 */
export const renderWithHttpClient = (
  ui: ReactElement,
  httpClient = createAxiosMock(),
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: WrapperProps) => (
    <HttpClientContext.Provider value={httpClient}>
      {children}
    </HttpClientContext.Provider>
  );
  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    httpClient,
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Export custom render as default render
export { customRender as render };

// Export utilities for custom wrapper scenarios
export { MockLink, MockNavLink, createMockMsalInstance, createTestQueryClient, createWrapper };
