import React, { type PropsWithChildren, type ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider, type PersistQueryClientOptions } from "@tanstack/react-query-persist-client";
import { type AnyRouter, RouterProvider } from "@tanstack/react-router";

import { Link, NavLink } from "./components";
import { AppProvider, HttpClientProvider } from "./providers";
import { LinkProvider, MessageProvider, ThemeProvider } from "@andrewmclachlan/moo-ds";

import getMsalInstance, { AUTH_RECOVERED_EVENT, type MsalOptions } from "./login/msal";

import { MsalProvider } from "@azure/msal-react";
import { type IPublicClientApplication } from "@azure/msal-browser";
import { Login } from "./login/Login";

import { faArrowRightFromBracket, faMoon, faSun, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { type AxiosInstance } from "axios";


library.add(faArrowRightFromBracket, faMoon, faSun, faTimesCircle);

export const MooApp: React.FC<PropsWithChildren<MooAppProps>> = ({ router, clientId, auth, scopes = [], baseUrl = "/", client, name, version, copyrightYear, authFallback, queryPersistOptions }) => {

  const [msalInstance, setMsalInstance] = React.useState<IPublicClientApplication | null>(null);

  useEffect(() => {
    getMsalInstance(clientId, auth).then((instance) => setMsalInstance(instance));
    // `auth` is app-initialisation config and is intentionally read once alongside clientId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        networkMode: "offlineFirst",
      },
      mutations: {
        networkMode: "offlineFirst",
      },
    }
  }));

  useEffect(() => {
    if (!version) return undefined;

    const meta = document.createElement("meta");
    meta.setAttribute("name", "version");
    meta.setAttribute("content", version);
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, [version]);

  useEffect(() => {
    const onAuthRecovered = () => {
      queryClient.invalidateQueries();
    };

    window.addEventListener(AUTH_RECOVERED_EVENT, onAuthRecovered);
    return () => {
      window.removeEventListener(AUTH_RECOVERED_EVENT, onAuthRecovered);
    };
  }, [queryClient]);

  if (!msalInstance) return null;

  const app = (
    <LinkProvider LinkComponent={Link} NavLinkComponent={NavLink}>
      <MessageProvider>
        <Login authFallback={authFallback}>
          <RouterProvider router={router} />
        </Login>
      </MessageProvider>
    </LinkProvider>
  );

  return (
    <AppProvider name={name} version={version} copyrightYear={copyrightYear}>
      <ThemeProvider>
        <MsalProvider instance={msalInstance}>
          <HttpClientProvider client={client} baseUrl={baseUrl} scopes={scopes}>
            {queryPersistOptions ?
              <PersistQueryClientProvider client={queryClient} persistOptions={queryPersistOptions}>
                {app}
              </PersistQueryClientProvider> :
              <QueryClientProvider client={queryClient}>
                {app}
              </QueryClientProvider>
            }
          </HttpClientProvider>
        </MsalProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

export interface MooAppProps {
  clientId: string,
  /** Optional MSAL configuration overrides (authority/tenant, redirect URIs, cache, login scopes). */
  auth?: MsalOptions,
  scopes?: string[],
  baseUrl?: string,
  client?: AxiosInstance;
  name?: string,
  version?: string;
  copyrightYear?: number;
  router: AnyRouter;
  authFallback?: ReactNode;
  queryPersistOptions?: Omit<PersistQueryClientOptions, "queryClient">;
}
