import { InteractionType } from "@azure/msal-browser";
import { useIsAuthenticated, useMsalAuthentication } from "@azure/msal-react";
import { PropsWithChildren, ReactNode } from "react";
import { loginRequest } from "./msal";

export interface LoginProps {
  authFallback?: ReactNode;
}

export const Login: React.FC<PropsWithChildren<LoginProps>> = ({children, authFallback}) => {

  useMsalAuthentication(InteractionType.Redirect, loginRequest);
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return <>{authFallback ?? null}</>;

  return <>{children}</>;
}