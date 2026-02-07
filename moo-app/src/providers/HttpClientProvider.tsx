import React, { useContext, useEffect, useMemo } from "react";
import axios, { AxiosInstance } from "axios";

import { IMsalContext, useMsal } from "@azure/msal-react";
import { AuthError, InteractionRequiredAuthError, InteractionStatus, IPublicClientApplication, SilentRequest } from "@azure/msal-browser";
import { loginRequest } from "../login/msal";

export interface HttpClientProviderProps {
    client?: AxiosInstance;
    baseUrl?: string;
    scopes?: string[];
}

export const HttpClientContext = React.createContext<AxiosInstance | undefined>(undefined);
type RedirectState = {
    redirectInFlight: boolean;
};
const redirectStateByClient = new WeakMap<IPublicClientApplication, RedirectState>();

const getRedirectState = (client: IPublicClientApplication): RedirectState => {
    let state = redirectStateByClient.get(client);
    if (!state) {
        state = { redirectInFlight: false };
        redirectStateByClient.set(client, state);
    }
    return state;
};

export const HttpClientProvider: React.FC<React.PropsWithChildren<HttpClientProviderProps>> = ({ client, baseUrl, scopes = [], children }) => {

    const msal = useMsal();

    if (!client && !baseUrl) throw new Error("You must provide either a client or a baseUrl to HttpClientProvider");

    const resolvedClient = useMemo(() => client ?? createHttpClient(baseUrl!), [client, baseUrl]);
    const scopeKey = scopes.join(" ");
    const effectiveScopes = useMemo(() => scopes, [scopeKey]);

    useEffect(() => {
        const interceptorId = addMsalInterceptor(resolvedClient, msal, effectiveScopes);
        return () => {
            resolvedClient.interceptors.request.eject(interceptorId);
        };
    }, [resolvedClient, msal, effectiveScopes]);

    return (
        <HttpClientContext.Provider value={resolvedClient}>
            {children}
        </HttpClientContext.Provider>
    );
}

export const useHttpClient = () => useContext(HttpClientContext);

export const createHttpClient = (baseUrl: string): AxiosInstance => {

    const httpClient = axios.create({
        baseURL: baseUrl,
        headers: {
            "Accept": "application/json",
        }
    });

    return httpClient;
}

export const addMsalInterceptor = (httpClient: AxiosInstance, msal: IMsalContext, scopes: string[]) => {
    return httpClient.interceptors.request.use(async (request) => {

        let token = null;
        const account = msal.instance.getActiveAccount() ?? msal.instance.getAllAccounts()[0];
        const redirectState = getRedirectState(msal.instance);

        if (redirectState.redirectInFlight && msal.inProgress === InteractionStatus.None) {
            redirectState.redirectInFlight = false;
        }

        const tokenRequest: SilentRequest = {
            scopes: scopes ?? [],
            ...(account ? { account } : {})
        };

        try {
            token = await msal.instance.acquireTokenSilent(tokenRequest);
        }
        catch (error) {
            const isInteractionRequiredError = error instanceof InteractionRequiredAuthError;
            const errorCode = (error as AuthError)?.errorCode;
            const shouldRedirect =
                isInteractionRequiredError ||
                errorCode === "invalid_grant" ||
                errorCode === "interaction_required" ||
                errorCode === "login_required" ||
                errorCode === "consent_required";

            if (shouldRedirect) {
                if (!redirectState.redirectInFlight && msal.inProgress === InteractionStatus.None) {
                    redirectState.redirectInFlight = true;
                    const interactiveScopes = Array.from(new Set([...(loginRequest.scopes ?? []), ...scopes]));
                    try {
                        await msal.instance.acquireTokenRedirect({
                            ...loginRequest,
                            scopes: interactiveScopes,
                            ...(account ? { account } : {})
                        });
                    } catch (redirectError) {
                        redirectState.redirectInFlight = false;
                        throw redirectError;
                    }
                }

                throw new axios.CanceledError("Request canceled: interactive authentication redirect required.");
            } else {
                console.warn("Error getting token silently:", error, "errorCode:", errorCode);
            }
        }

        if (token?.accessToken) {
            request.headers.setAuthorization(`Bearer ${token.accessToken}`);
        }

        return request;
    });
}
