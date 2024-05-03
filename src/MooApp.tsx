import React, { PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppProvider, HttpClientProvider, MessageProvider } from "./providers";

import getMsalInstance from "./login/msal";

import { MsalProvider } from "@azure/msal-react";
import { Login } from "./login/Login";

export const MooApp: React.FC<PropsWithChildren<MooAppProps>> = ({ children, clientId, scopes = [], baseUrl = "/", name, version }) => {

  const [msalInstance, setMsalInstance] = React.useState<any>(null);

  useEffect(() => {
    getMsalInstance(clientId).then((instance) => setMsalInstance(instance));
  }, []);

  const queryClient = new QueryClient({
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
  });

  if (!msalInstance) return null;

  return (
    <AppProvider name={name} version={version}>
      <MsalProvider instance={msalInstance}>
        <HttpClientProvider baseUrl={baseUrl} scopes={scopes}>
          <QueryClientProvider client={queryClient}>
            <MessageProvider>
              <Login>
                {children}
              </Login>
            </MessageProvider>
          </QueryClientProvider>
        </HttpClientProvider>
      </MsalProvider>
    </AppProvider >
  );
};

export interface MooAppProps {
  clientId: string,
  scopes?: string[],
  baseUrl?: string,
  name?: string,
  version?: string;
}
