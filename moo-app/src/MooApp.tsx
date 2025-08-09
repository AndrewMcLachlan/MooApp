import React, { PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppProvider, HttpClientProvider } from "./providers";
import { MessageProvider } from "@andrewmclachlan/moo-ds";

import getMsalInstance from "./login/msal";

import { MsalProvider } from "@azure/msal-react";
import { Login } from "./login/Login";

import { faArrowRightFromBracket, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faArrowRightFromBracket, faTimesCircle);

export const MooApp: React.FC<PropsWithChildren<MooAppProps>> = ({ children, clientId, scopes = [], baseUrl = "/", name, version, copyrightYear }) => {

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

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "version")
    meta.setAttribute("content", version);
    document.head.appendChild(meta);
  }, []);

  if (!msalInstance) return null;

  return (
    <AppProvider name={name} version={version} copyrightYear={copyrightYear}>
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
    </AppProvider>
  );
};

export interface MooAppProps {
  clientId: string,
  scopes?: string[],
  baseUrl?: string,
  name?: string,
  version?: string;
  copyrightYear?: number;
}
