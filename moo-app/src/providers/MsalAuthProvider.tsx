import React, { useEffect, useLayoutEffect, useRef } from "react";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { type IMsalContext, useMsal } from "@azure/msal-react";
import { AuthError, type AuthenticationResult, EventType, InteractionStatus, InteractionType, type IPublicClientApplication, type SilentRequest } from "@azure/msal-browser";
import { getSilentRedirectUri, loginRequest } from "../login/msal";

export interface MsalAuthProviderProps {
    /**
     * The axios instance to authenticate — typically your hey-api generated
     * client's underlying instance (`client.instance`). An MSAL access-token
     * request interceptor is attached to it.
     */
    client: AxiosInstance;
    /** API scopes requested for the access token. */
    scopes?: string[];
}

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

/**
 * Attaches an MSAL access-token request interceptor to the supplied axios
 * instance. Tokens are acquired silently; on a recoverable MSAL auth error the
 * request falls back to an interactive redirect. Renders its children unchanged
 * — it exposes no context, it only wires up the client.
 */
export const MsalAuthProvider: React.FC<React.PropsWithChildren<MsalAuthProviderProps>> = ({ client, scopes = [], children }) => {

    const msal = useMsal();

    // Use refs so the interceptor always reads the latest MSAL context and scopes
    // without needing to be torn down and recreated on every context change.
    const msalRef = useRef(msal);
    msalRef.current = msal;

    const scopesRef = useRef(scopes);
    scopesRef.current = scopes;

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
        const interceptorId = client.interceptors.request.use(
            (request) => acquireTokenForRequest(request, msalRef, scopesRef)
        );
        return () => {
            client.interceptors.request.eject(interceptorId);
        };
    }, [client]);

    return (
        <>
            {children}
        </>
    );
}

const acquireTokenForRequest = async (
    request: InternalAxiosRequestConfig,
    msalRef: React.RefObject<IMsalContext>,
    scopesRef: React.RefObject<string[]>,
): Promise<InternalAxiosRequestConfig> => {
    const msal = msalRef.current;
    const scopes = scopesRef.current;

    let token: AuthenticationResult;
    const account = msal.instance.getActiveAccount() ?? msal.instance.getAllAccounts()[0];
    const redirectState = getRedirectState(msal.instance);

    // Point silent renewals at a blank page (if configured) so the hidden iframe
    // doesn't re-boot the SPA and trigger block_iframe_reload. Interactive
    // redirects below intentionally keep the default redirectUri so the user is
    // returned to the page that initiated login.
    const silentRedirectUri = getSilentRedirectUri();

    const tokenRequest: SilentRequest = {
        scopes: scopes ?? [],
        ...(account ? { account } : {}),
        ...(silentRedirectUri ? { redirectUri: silentRedirectUri } : {})
    };

    try {
        token = await msal.instance.acquireTokenSilent(tokenRequest);
    }
    catch (error) {
        const errorCode = (error as AuthError)?.errorCode;

        // Don't redirect for non-recoverable errors (network failures,
        // misconfiguration, or an interaction already in progress).
        const isNonRecoverable =
            errorCode === "network_error" ||
            errorCode === "interaction_in_progress" ||
            !(error instanceof AuthError);

        if (isNonRecoverable) {
            console.warn("Error getting token silently:", error, "errorCode:", errorCode);
            throw new axios.CanceledError("Request canceled: unable to acquire authentication token.");
        }

        // For any MSAL auth error (expired tokens, consent required, iframe
        // timeouts, etc.), fall back to interactive redirect.
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
    }

    if (token.accessToken) {
        request.headers.setAuthorization(`Bearer ${token.accessToken}`);
    }

    return request;
};

/**
 * Attaches the MSAL access-token interceptor to an arbitrary axios instance
 * imperatively (used internally for the MS Graph client). Returns the
 * interceptor id so it can be ejected.
 */
export const addMsalInterceptor = (httpClient: AxiosInstance, msal: IMsalContext, scopes: string[]) => {
    const msalRef = { current: msal } as React.RefObject<IMsalContext>;
    const scopesRef = { current: scopes } as React.RefObject<string[]>;
    return httpClient.interceptors.request.use(
        (request) => acquireTokenForRequest(request, msalRef, scopesRef)
    );
}
