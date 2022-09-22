import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { PropsWithChildren } from "react";

export const Login: React.FC<PropsWithChildren<unknown>> = ({children}) => {

  useMsalAuthentication(InteractionType.Redirect);

  return <>{children}</>;
}