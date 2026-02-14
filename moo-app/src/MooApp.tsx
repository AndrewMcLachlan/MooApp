import React, { PropsWithChildren, ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppProvider, HttpClientProvider } from "./providers";
import { LinkProvider, MessageProvider } from "@andrewmclachlan/moo-ds";

import getMsalInstance, { AUTH_RECOVERED_EVENT } from "./login/msal";

import { MsalProvider } from "@azure/msal-react";
import { Login } from "./login/Login";

import { faArrowRightFromBracket, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { LinkWrapper, NavLinkWrapper } from "./components/LinkWrapper";
import { RouterProvider, RouterProviderProps } from "react-router";
import { AxiosInstance } from "axios";

library.add(faArrowRightFromBracket, faTimesCircle);

export const MooApp: React.FC<PropsWithChildren<MooAppProps>> = ({ router, clientId, scopes = [], baseUrl = "/", client, name, version, copyrightYear, authFallback }) => {

  const [msalInstance, setMsalInstance] = React.useState<any>(null);

  useEffect(() => {
    getMsalInstance(clientId).then((instance) => setMsalInstance(instance));
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

  return (
    <AppProvider name={name} version={version} copyrightYear={copyrightYear}>
      <MsalProvider instance={msalInstance}>
        <HttpClientProvider client={client} baseUrl={baseUrl} scopes={scopes}>
          <QueryClientProvider client={queryClient}>
            <LinkProvider LinkComponent={LinkWrapper} NavLinkComponent={NavLinkWrapper}>
              <MessageProvider>
                <Login authFallback={authFallback}>
                  <RouterProvider router={router} />
                </Login>
              </MessageProvider>
            </LinkProvider>
          </QueryClientProvider>
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
  router: RouterProviderProps["router"];
  authFallback?: ReactNode;
}
