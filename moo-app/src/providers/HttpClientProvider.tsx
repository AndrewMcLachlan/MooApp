import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { IMsalContext, useMsal } from "@azure/msal-react";
import { AuthError, EventType, InteractionRequiredAuthError, InteractionStatus, InteractionType, IPublicClientApplication, SilentRequest } from "@azure/msal-browser";
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

    // Use refs so the interceptor always reads the latest MSAL context and scopes
    // without needing to be torn down and recreated on every context change.
    const msalRef = useRef(msal);
    msalRef.current = msal;

    const scopesRef = useRef(effectiveScopes);
    scopesRef.current = effectiveScopes;

    useEffect(() => {
        const redirectState = getRedirectState(msal.instance);
        const callbackId = msal.instance.addEventCallback((event) => {
            const isInteractiveEvent =
                event.interactionType === InteractionType.Redirect ||
                event.interactionType === InteractionType.Popup;

            const shouldReset =
                event.eventType === EventType.HANDLE_REDIRECT_END ||
                ((event.eventType === EventType.LOGIN_SUCCESS ||
                    event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
                    event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) &&
                    isInteractiveEvent);

            if (shouldReset) {
                redirectState.redirectInFlight = false;
            }
        });

        return () => {
            if (callbackId) {
                msal.instance.removeEventCallback(callbackId);
            }
        };
    }, [msal.instance]);

    // useLayoutEffect fires before children's useEffect, ensuring the interceptor
    // is in place before React Query (or any other data-fetching library) triggers
    // its first request. Using refs avoids recreating the interceptor when the MSAL
    // context or scopes change — the interceptor reads the latest values at call time.
    useLayoutEffect(() => {
        const interceptorId = resolvedClient.interceptors.request.use(
            (request) => acquireTokenForRequest(request, msalRef, scopesRef)
        );
        return () => {
            resolvedClient.interceptors.request.eject(interceptorId);
        };
    }, [resolvedClient]);

    return (
        <HttpClientContext.Provider value={resolvedClient}>
            {children}
        </HttpClientContext.Provider>
    );
}

export const useHttpClient = () => {
    const context = useContext(HttpClientContext);
    if (!context) {
        throw new Error("useHttpClient must be used within a HttpClientProvider");
    }
    return context;
};

export const createHttpClient = (baseUrl: string): AxiosInstance => {

    const httpClient = axios.create({
        baseURL: baseUrl,
        headers: {
            "Accept": "application/json",
        }
    });

    return httpClient;
}

const acquireTokenForRequest = async (
    request: InternalAxiosRequestConfig,
    msalRef: React.RefObject<IMsalContext>,
    scopesRef: React.RefObject<string[]>,
): Promise<InternalAxiosRequestConfig> => {
    const msal = msalRef.current;
    const scopes = scopesRef.current;

    let token = null;
    const account = msal.instance.getActiveAccount() ?? msal.instance.getAllAccounts()[0];
    const redirectState = getRedirectState(msal.instance);

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
            errorCode === "consent_required" ||
            errorCode === "no_account_error";

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
            throw new axios.CanceledError("Request canceled: unable to acquire authentication token.");
        }
    }

    if (token?.accessToken) {
        request.headers.setAuthorization(`Bearer ${token.accessToken}`);
    }

    return request;
};

export const addMsalInterceptor = (httpClient: AxiosInstance, msal: IMsalContext, scopes: string[]) => {
    const msalRef = { current: msal } as React.RefObject<IMsalContext>;
    const scopesRef = { current: scopes } as React.RefObject<string[]>;
    return httpClient.interceptors.request.use(
        (request) => acquireTokenForRequest(request, msalRef, scopesRef)
    );
}
