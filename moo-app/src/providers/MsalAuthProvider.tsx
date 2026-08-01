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
 * Whether this is the top-level window rather than a frame.
 *
 * MSAL renews tokens in a hidden iframe. Unless silentRedirectUri points at a
 * scriptless page the iframe boots the SPA, so this interceptor runs inside it
 * -- and an interactive redirect started there navigates the frame rather than
 * the page, which loops. silentRedirectUri is opt-in and unset by default, so
 * a consumer that has not configured it, or whose blank page is not yet
 * registered as a reply URI, has no protection without this check.
 *
 * @see https://learn.microsoft.com/en-us/entra/msal/javascript/browser/errors#block_iframe_reload
 */
const isTopWindow = (): boolean => {
    try {
        return window.self === window.top;
    } catch {
        // Reading window.top across origins throws, which only happens framed.
        return false;
    }
};

/**
 * Bounds *sequential* interactive redirects, which redirectStateByClient
 * cannot: a redirect discards the page and takes the WeakMap with it, so the
 * in-memory guard only ever bounds concurrent callers within one page load.
 * Held in sessionStorage so it survives the navigation, and scoped to the tab
 * so one tab recovering does not consume another's attempt.
 */
const INTERACTIVE_RECOVERY_ATTEMPTED = "mooappInteractiveRecoveryAttempted";

// sessionStorage throws where storage is blocked -- private browsing, some
// embedded webviews, a restrictive cookie policy. Authentication must not be
// the thing that breaks there, so each access degrades to "no marker", which
// restores the previous behaviour rather than blocking recovery outright.
const interactiveRecoveryAttempted = (): boolean => {
    try {
        return sessionStorage.getItem(INTERACTIVE_RECOVERY_ATTEMPTED) !== null;
    } catch {
        return false;
    }
};

const markInteractiveRecoveryAttempted = (): void => {
    try {
        sessionStorage.setItem(INTERACTIVE_RECOVERY_ATTEMPTED, "1");
    } catch {
        // Storage unavailable; the in-memory guard still bounds concurrent callers.
    }
};

const clearInteractiveRecoveryAttempt = (): void => {
    try {
        sessionStorage.removeItem(INTERACTIVE_RECOVERY_ATTEMPTED);
    } catch {
        // Nothing to clear if it could never be written.
    }
};

/** Marker carried by cancellations raised by the auth interceptors. */
const authCancellationMarker = Symbol.for("mooapp.authCancellation");

type MarkedCanceledError = InstanceType<typeof axios.CanceledError> & { [authCancellationMarker]?: boolean };

const authCanceledError = (message: string): MarkedCanceledError =>
    Object.assign(new axios.CanceledError(message) as MarkedCanceledError, { [authCancellationMarker]: true });

/**
 * True when the error is a request cancellation raised by the MSAL auth
 * interceptors (silent acquisition failed / an interactive redirect is being
 * initiated). Lets query-layer retry policy keep these requests pending across
 * an auth window instead of surfacing them as hard errors.
 */
export const isAuthCancellation = (error: unknown): boolean =>
    axios.isCancel(error) && (error as MarkedCanceledError)[authCancellationMarker] === true;

/** Axios config flag capping 401 recovery at a single retry per request. */
type RetriableConfig = InternalAxiosRequestConfig & { mooappRetriedAfter401?: boolean };

// One force-refresh in flight per MSAL instance: a page of widgets failing
// together must not stampede the token endpoint.
const forceRefreshByInstance = new WeakMap<IPublicClientApplication, Promise<AuthenticationResult>>();

/**
 * Attaches MSAL access-token interceptors to the supplied axios instance:
 * a request interceptor that acquires tokens silently (falling back to an
 * interactive redirect on recoverable auth errors), and a response interceptor
 * that recovers from a 401 by force-refreshing the token and retrying the
 * request once. Renders its children unchanged — it exposes no context, it
 * only wires up the client.
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
        const responseInterceptorId = client.interceptors.response.use(
            undefined,
            (error) => retryAfterUnauthorized(error, client, msalRef, scopesRef)
        );
        return () => {
            client.interceptors.request.eject(interceptorId);
            client.interceptors.response.eject(responseInterceptorId);
        };
    }, [client]);

    return (
        <>
            {children}
        </>
    );
}

const buildSilentRequest = (msal: IMsalContext, scopes: string[]): SilentRequest => {
    const account = msal.instance.getActiveAccount() ?? msal.instance.getAllAccounts()[0];

    // Point silent renewals at a blank page (if configured) so the hidden iframe
    // doesn't re-boot the SPA and trigger block_iframe_reload. Interactive
    // redirects intentionally keep the default redirectUri so the user is
    // returned to the page that initiated login.
    const silentRedirectUri = getSilentRedirectUri();

    return {
        scopes: scopes ?? [],
        ...(account ? { account } : {}),
        ...(silentRedirectUri ? { redirectUri: silentRedirectUri } : {})
    };
};

/**
 * Shared failure path for silent token acquisition. Non-recoverable errors
 * (network failures, misconfiguration, interaction already in progress) cancel
 * the request outright; recoverable MSAL auth errors trigger a single guarded
 * interactive redirect. Always throws.
 */
const handleSilentFailure = async (
    error: unknown,
    msal: IMsalContext,
    scopes: string[],
    silentRequest: SilentRequest,
): Promise<never> => {
    const errorCode = (error as AuthError)?.errorCode;

    // Don't redirect for non-recoverable errors (network failures,
    // misconfiguration, or an interaction already in progress).
    const isNonRecoverable =
        errorCode === "network_error" ||
        errorCode === "interaction_in_progress" ||
        !(error instanceof AuthError);

    if (isNonRecoverable) {
        console.warn("Error getting token silently:", error, "errorCode:", errorCode);
        throw authCanceledError("Request canceled: unable to acquire authentication token.");
    }

    // A silent-renewal iframe has no user to interact with, and redirecting
    // from one navigates the frame rather than the page. Cancel quietly: the
    // frame is discarded either way, so logging a failure per renewal would be
    // noise.
    if (!isTopWindow()) {
        throw authCanceledError("Request canceled: silent renewal cannot start an interactive redirect.");
    }

    // For any MSAL auth error (expired tokens, consent required, iframe
    // timeouts, etc.), fall back to interactive redirect.
    const redirectState = getRedirectState(msal.instance);
    if (!redirectState.redirectInFlight && msal.inProgress === InteractionStatus.None) {

        // We have already been through an interactive redirect in this tab and
        // are still failing, so another cannot help -- a corrupt cache entry, a
        // scope that cannot be consented, an unsatisfiable Conditional Access
        // policy. Surface the underlying error rather than cancelling:
        // authCanceledError feeds MooApp's retry policy, which would leave the
        // app sitting on a loading state instead of showing what went wrong.
        if (interactiveRecoveryAttempted()) {
            console.error(
                "Token acquisition still requires interaction after an interactive redirect; not redirecting again.",
                error,
            );
            throw error;
        }

        markInteractiveRecoveryAttempted();
        redirectState.redirectInFlight = true;
        const interactiveScopes = Array.from(new Set([...(loginRequest.scopes ?? []), ...scopes]));
        try {
            await msal.instance.acquireTokenRedirect({
                ...loginRequest,
                scopes: interactiveScopes,
                ...(silentRequest.account ? { account: silentRequest.account } : {})
            });
        } catch (redirectError) {
            redirectState.redirectInFlight = false;
            // Nothing navigated, so the attempt was not spent. Leaving the
            // marker set would disable recovery for the rest of the tab's life.
            clearInteractiveRecoveryAttempt();
            throw redirectError;
        }
    }

    throw authCanceledError("Request canceled: interactive authentication redirect required.");
};

const acquireTokenForRequest = async (
    request: InternalAxiosRequestConfig,
    msalRef: React.RefObject<IMsalContext>,
    scopesRef: React.RefObject<string[]>,
): Promise<InternalAxiosRequestConfig> => {
    const msal = msalRef.current;
    const scopes = scopesRef.current;

    let token: AuthenticationResult;
    const tokenRequest = buildSilentRequest(msal, scopes);

    try {
        token = await msal.instance.acquireTokenSilent(tokenRequest);
    }
    catch (error) {
        return handleSilentFailure(error, msal, scopes, tokenRequest);
    }

    // Silent acquisition works again, so the bound is spent rather than
    // permanent -- a token expiring hours from now must still be able to
    // recover interactively.
    clearInteractiveRecoveryAttempt();

    if (token.accessToken) {
        request.headers.setAuthorization(`Bearer ${token.accessToken}`);
    }

    return request;
};

/**
 * Response-side recovery: MSAL judges token validity by local expiry alone, so
 * a token the server rejects (signing-key rollover, Conditional Access /
 * sign-in frequency, clock skew) would otherwise fail every request until it
 * naturally expires. On a 401, force-refresh the token and retry the request
 * exactly once.
 *
 * Loop safety: the retry is capped by a per-request config flag (a retried
 * request that 401s again rejects with the original error), the force refresh
 * is single-flight per MSAL instance, and a failed refresh falls into the same
 * guarded redirect path as request-side failures — it never triggers another
 * retry.
 */
const retryAfterUnauthorized = async (
    error: unknown,
    client: AxiosInstance,
    msalRef: React.RefObject<IMsalContext>,
    scopesRef: React.RefObject<string[]>,
): Promise<unknown> => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error;
    }

    const config = error.config as RetriableConfig | undefined;
    if (!config || config.mooappRetriedAfter401) {
        throw error;
    }
    config.mooappRetriedAfter401 = true;

    const msal = msalRef.current;
    const scopes = scopesRef.current;
    const tokenRequest = buildSilentRequest(msal, scopes);

    let inflight = forceRefreshByInstance.get(msal.instance);
    if (!inflight) {
        inflight = msal.instance
            .acquireTokenSilent({ ...tokenRequest, forceRefresh: true })
            .finally(() => { forceRefreshByInstance.delete(msal.instance); });
        forceRefreshByInstance.set(msal.instance, inflight);
    }

    let token: AuthenticationResult;
    try {
        token = await inflight;
    }
    catch (refreshError) {
        return handleSilentFailure(refreshError, msal, scopes, tokenRequest);
    }

    // As on the request path: a working refresh releases the bound.
    clearInteractiveRecoveryAttempt();

    if (!token.accessToken) {
        throw error;
    }

    // Success also fires ACQUIRE_TOKEN_SUCCESS, which dispatches
    // AUTH_RECOVERED_EVENT — any queries that already errored refetch.
    config.headers.setAuthorization(`Bearer ${token.accessToken}`);
    return client.request(config);
};

/**
 * Attaches the MSAL access-token interceptors to an arbitrary axios instance
 * imperatively (used internally for the MS Graph client). Returns a function
 * that ejects both interceptors.
 */
export const addMsalInterceptor = (httpClient: AxiosInstance, msal: IMsalContext, scopes: string[]) => {
    const msalRef = { current: msal } as React.RefObject<IMsalContext>;
    const scopesRef = { current: scopes } as React.RefObject<string[]>;
    const responseInterceptorId = httpClient.interceptors.response.use(
        undefined,
        (error) => retryAfterUnauthorized(error, httpClient, msalRef, scopesRef)
    );
    const requestInterceptorId = httpClient.interceptors.request.use(
        (request) => acquireTokenForRequest(request, msalRef, scopesRef)
    );
    return () => {
        httpClient.interceptors.request.eject(requestInterceptorId);
        httpClient.interceptors.response.eject(responseInterceptorId);
    };
}
