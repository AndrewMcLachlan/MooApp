import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { BrowserRouter } from "react-router-dom";

import { HttpClientProvider } from "./providers";

import getMsalInstance from "./login/msal";

import { MsalProvider } from "@azure/msal-react";
import { Login } from "./login/Login";

export const MooApp: React.FC<PropsWithChildren<MooAppProps>> = ({ children, clientId, scopes, baseUrl }) => {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  });

  return (
    <MsalProvider instance={getMsalInstance(clientId)}>
      <HttpClientProvider baseUrl={baseUrl} scopes={scopes}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Login>
              {children}
            </Login>
          </BrowserRouter>
        </QueryClientProvider>
      </HttpClientProvider>
    </MsalProvider>
  );
};

MooApp.defaultProps = {
  scopes: [],
  baseUrl: "/"
};

export interface MooAppProps {
  clientId: string,
  scopes?: string[],
  baseUrl?: string,
}