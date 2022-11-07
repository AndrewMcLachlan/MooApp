import React, { useContext } from "react";
import axios, { AxiosInstance } from "axios";

import { apiRequest, loginRequest } from "../login/msal";

import { useMsal } from "@azure/msal-react";
import { AuthError, InteractionRequiredAuthError, ServerError } from "@azure/msal-browser";
import { BrowserConstants } from "@azure/msal-browser/dist/utils/BrowserConstants";

export interface HttpClientProviderProps {
    baseUrl: string;
}

export const HttpClientContext = React.createContext<AxiosInstance | undefined>(undefined);
export const HttpClientProvider: React.FC<React.PropsWithChildren<HttpClientProviderProps>> = ({ baseUrl, children }) => {

    return (
        <HttpClientContext.Provider value={useCreateHttpClient(baseUrl)}>
            {children}
        </HttpClientContext.Provider>
    );
};

export const useHttpClient = () => useContext(HttpClientContext);

const useCreateHttpClient = (baseUrl: string): AxiosInstance => {

    const msal = useMsal();

    const httpClient = axios.create({
        baseURL: baseUrl,
        headers: {
            "Accept": "application/json",
        }
    });

    httpClient.interceptors.request.use(async (request) => {

        let token = null;

        try {
            token = await msal.instance.acquireTokenSilent(apiRequest);
        }
        catch (error) {

            const isServerError = error instanceof ServerError;
            const isInteractionRequiredError = error instanceof InteractionRequiredAuthError;
            const isInvalidGrantError = (error as AuthError)?.errorCode === BrowserConstants.INVALID_GRANT_ERROR;

            if ((isServerError && isInvalidGrantError) || isInteractionRequiredError) {
                await msal.instance.loginRedirect(loginRequest);
                token = await msal.instance.acquireTokenSilent(apiRequest);
            } else {
                console.warn("Error getting token silently: " + error);
            }
        }

        request.headers = {
            "Authorization": `Bearer ${token.accessToken}`
        };
        return request;
    });

    return httpClient;
}