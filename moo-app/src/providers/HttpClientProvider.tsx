import React, { useContext } from "react";
import axios, { AxiosInstance } from "axios";

import { loginRequest } from "../login/msal";

import { useMsal } from "@azure/msal-react";
import { AuthError, InteractionRequiredAuthError, ServerError, SilentRequest } from "@azure/msal-browser";

export interface HttpClientProviderProps {
    baseUrl: string;
    scopes?: string[];
}

export const HttpClientContext = React.createContext<AxiosInstance | undefined>(undefined);
export const HttpClientProvider: React.FC<React.PropsWithChildren<HttpClientProviderProps>> = ({ baseUrl, scopes = [], children }) => (
    <HttpClientContext.Provider value={useCreateHttpClient(baseUrl, scopes)}>
        {children}
    </HttpClientContext.Provider>
);

export const useHttpClient = () => useContext(HttpClientContext);

export const useCreateHttpClient = (baseUrl: string, scopes?: string[]): AxiosInstance => {

    const msal = useMsal();

    const httpClient = axios.create({
        baseURL: baseUrl,
        headers: {
            "Accept": "application/json",
        }
    });

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

    return httpClient;
}
