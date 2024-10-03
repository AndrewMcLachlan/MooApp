import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { PropsWithChildren } from "react";
import { loginRequest } from "./msal";

export const Login: React.FC<PropsWithChildren<unknown>> = ({children}) => {

  useMsalAuthentication(InteractionType.Redirect, loginRequest);

  return <>{children}</>;
}