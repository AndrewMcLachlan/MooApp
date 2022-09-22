import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { BrowserRouter } from "react-router-dom";

import { HttpClientProvider } from "./providers";

import getMsalInstance from "./login/msal";

import { MsalProvider } from "@azure/msal-react";
import { Login } from "./login/Login";

export const MooApp: React.FC<PropsWithChildren<MooAppProps>> = ({ children, clientId }) => {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  });

  return (
    <React.StrictMode>
      <MsalProvider instance={getMsalInstance(clientId)}>
        <HttpClientProvider baseUrl="/">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Login>
                {children}
              </Login>
            </BrowserRouter>
          </QueryClientProvider>
        </HttpClientProvider>
      </MsalProvider>
    </React.StrictMode>
  );
};

export interface MooAppProps {
  clientId: string
}