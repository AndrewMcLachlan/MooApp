import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal, useMsalAuthentication } from "@azure/msal-react";
import { type PropsWithChildren, type ReactNode } from "react";
import { loginRequest } from "./msal";

export interface LoginProps {
  authFallback?: ReactNode;
}

export const Login: React.FC<PropsWithChildren<LoginProps>> = ({children, authFallback}) => {

  useMsalAuthentication(InteractionType.Redirect, loginRequest);
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  // Gate on BOTH an authenticated account and MSAL being idle. On a re-auth
  // reload a cached account makes isAuthenticated true immediately, but MSAL is
  // still mid-flight (handling the redirect response / ssoSilent). Rendering
  // data-fetching children during that window races the access-token interceptor:
  // acquireTokenSilent throws interaction_in_progress, the request is cancelled
  // before it is sent, and with the QueryClient's retry:false the query stays
  // errored (e.g. dashboard widgets showing "Unable to load"). Waiting for
  // InteractionStatus.None lets the token be acquirable before the first request.
  if (!isAuthenticated || inProgress !== InteractionStatus.None) return <>{authFallback ?? null}</>;

  return <>{children}</>;
}