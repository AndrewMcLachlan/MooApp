import React, { type PropsWithChildren, type ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider, type PersistQueryClientOptions } from "@tanstack/react-query-persist-client";
import { type AnyRouter, RouterProvider } from "@tanstack/react-router";

import { Link, NavLink } from "./components";
import { AppProvider, HttpClientProvider } from "./providers";
import { LinkProvider, MessageProvider } from "@andrewmclachlan/moo-ds";

import getMsalInstance, { AUTH_RECOVERED_EVENT } from "./login/msal";

import { MsalProvider } from "@azure/msal-react";
import { Login } from "./login/Login";

import { faArrowRightFromBracket, faMoon, faSun, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { type AxiosInstance } from "axios";


library.add(faArrowRightFromBracket, faMoon, faSun, faTimesCircle);

export const MooApp: React.FC<PropsWithChildren<MooAppProps>> = ({ router, clientId, scopes = [], baseUrl = "/", client, name, version, copyrightYear, authFallback, queryPersistOptions, redirectUri }) => {

  const [msalInstance, setMsalInstance] = React.useState<any>(null);

  useEffect(() => {
    getMsalInstance(clientId, { redirectUri }).then((instance) => setMsalInstance(instance));
  }, []);

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
    const meta = document.createElement("meta");
    meta.setAttribute("name", "version")
    meta.setAttribute("content", version);
    document.head.appendChild(meta);
  }, []);

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
    </AppProvider>
  );
};

export interface MooAppProps {
  clientId: string,
  scopes?: string[],
  baseUrl?: string,
  client?: AxiosInstance;
  name?: string,
  version?: string;
  copyrightYear?: number;
  router: AnyRouter;
  authFallback?: ReactNode;
  queryPersistOptions?: Omit<PersistQueryClientOptions, "queryClient">;
  /**
   * Overrides the MSAL redirect URI. Point this at a lightweight page that does
   * not boot the SPA (e.g. `${window.location.origin}/blank.html`) to stop
   * silent token renewals re-booting the app inside MSAL's hidden iframe and
   * emitting `BrowserAuthError: block_iframe_reload` (issue #607). The URI must
   * also be registered as a redirect URI on the Azure AD app registration.
   * Defaults to `window.location.origin`.
   */
  redirectUri?: string;
}
