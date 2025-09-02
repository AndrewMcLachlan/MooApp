import React, { useContext } from "react";
import axios, { AxiosInstance } from "axios";

import { loginRequest } from "../login/msal";

import { IMsalContext, useMsal } from "@azure/msal-react";
import { AuthError, InteractionRequiredAuthError, ServerError, SilentRequest } from "@azure/msal-browser";

export interface HttpClientProviderProps {
    client?: AxiosInstance;
    baseUrl?: string;
    scopes?: string[];
}

export const HttpClientContext = React.createContext<AxiosInstance | undefined>(undefined);
export const HttpClientProvider: React.FC<React.PropsWithChildren<HttpClientProviderProps>> = ({ client, baseUrl, scopes = [], children }) => {

    const msal = useMsal();

    if (!client && !baseUrl) throw new Error("You must provide either a client or a baseUrl to HttpClientProvider");

    if (!client) {
        client = createHttpClient(baseUrl!);
    }

    addMsalInterceptor(client, msal, scopes);

    return (
        <HttpClientContext.Provider value={client}>
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

    httpClient.interceptors.request.use(async (request) => {

        let token = null;

        const tokenRequest: SilentRequest = {
            scopes: scopes ?? [],
        };

        try {
            token = await msal.instance.acquireTokenSilent(tokenRequest);
        }
        catch (error) {

            const isServerError = error instanceof ServerError;
            const isInteractionRequiredError = error instanceof InteractionRequiredAuthError;
            const isInvalidGrantError = (error as AuthError)?.errorCode === "invalid_grant";

            if ((isServerError && isInvalidGrantError) || isInteractionRequiredError) {
                await msal.instance.loginRedirect(loginRequest);
                token = await msal.instance.acquireTokenSilent(tokenRequest);
            } else {
                console.warn("Error getting token silently: " + error);
            }
        }

        request.headers.setAuthorization(`Bearer ${token.accessToken}`);
        return request;
    });
}