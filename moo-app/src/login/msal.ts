import * as msal from "@azure/msal-browser";
export const AUTH_RECOVERED_EVENT = "mooapp:auth-recovered";

const msalConfig: msal.Configuration = {
    auth: {
        clientId: "",
        authority: "https://login.microsoftonline.com/30efefb9-9034-4e0c-8c69-17f4578f5924",
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "localStorage",
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: msal.RedirectRequest = {

    scopes: ["openid", "profile" ],
    //forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const apiRequest: msal.SilentRequest = {
    scopes: [],
    //forceRefresh: true // Set this to "true" to skip a cached token and go to the server to get a new token
};


/**
 * Optional overrides for the MSAL configuration, applied at instance-creation
 * time. Any value left unset falls back to the framework default, so existing
 * single-tenant consumers are unaffected while multi-tenant / differently-hosted
 * apps can configure the authority, redirect URIs, cache location, login scopes
 * and silent-renewal redirect URI without forking.
 */
export interface MsalOptions {
    /** The Azure AD authority (e.g. `https://login.microsoftonline.com/<tenant>`). */
    authority?: string;
    /** Redirect URI to return to after interactive login. Defaults to the current origin. */
    redirectUri?: string;
    /** Redirect URI to return to after logout. Defaults to the current origin. */
    postLogoutRedirectUri?: string;
    /** Where MSAL caches tokens. Defaults to `localStorage`. */
    cacheLocation?: msal.BrowserCacheLocation;
    /** Scopes requested at interactive login. Defaults to `["openid", "profile"]`. */
    loginScopes?: string[];
    /**
     * The redirect URI used **only** for silent token renewal (the hidden iframe
     * that MSAL opens for `acquireTokenSilent`). It is NOT used for interactive
     * login, so it does not affect where the user lands after signing in.
     *
     * By default silent renewals use the app's own `redirectUri`
     * (`window.location.origin`), which causes the whole SPA to re-boot inside
     * the hidden iframe; MSAL detects this and aborts with
     * `BrowserAuthError: block_iframe_reload` (see issue #607). Per MSAL's
     * guidance, point this at a lightweight blank page that does **not** load
     * MSAL — e.g. a `blank.html` served from your app's `public/` folder:
     *
     * ```tsx
     * <MooApp
     *     clientId="<client-id>"
     *     router={router}
     *     silentRedirectUri={`${window.location.origin}/blank.html`}
     * />
     * ```
     *
     * The blank page needs no scripts: the silent iframe returns the response in
     * its URL hash, which MSAL reads directly. Interactive login is unaffected
     * and still returns the user to the route they started from
     * (`navigateToLoginRequestUrl` defaults to `true`).
     *
     * NOTE: the URI must also be registered as a redirect (reply) URI on the
     * app's Azure AD registration, otherwise silent renewal will fail.
     *
     * @see https://learn.microsoft.com/en-us/entra/msal/javascript/browser/errors#block_iframe_reload
     */
    silentRedirectUri?: string;
}

let msalInstance: msal.IPublicClientApplication;
let initializedClientId: string | undefined;
let silentRedirectUri: string | undefined;

/**
 * The redirect URI to apply to silent token requests, or `undefined` to use the
 * MSAL default. Configured via {@link MsalOptions.silentRedirectUri}.
 */
export const getSilentRedirectUri = (): string | undefined => silentRedirectUri;

const getMsalInstance = async (clientId: string, options?: MsalOptions): Promise<msal.IPublicClientApplication> => {
    if (msalInstance) {
        // The instance is a module-level singleton; a second call with a
        // different clientId/authority can't reconfigure it. Warn rather than
        // silently returning a mismatched instance.
        if (initializedClientId !== clientId) {
            console.warn(
                `getMsalInstance was already initialized with clientId "${initializedClientId}"; ` +
                `ignoring the new clientId "${clientId}". MSAL configuration cannot be changed after initialization.`
            );
        }
        return msalInstance;
    }

    initializedClientId = clientId;
    msalConfig.auth.clientId = clientId;
    if (options?.authority) msalConfig.auth.authority = options.authority;
    if (options?.redirectUri) msalConfig.auth.redirectUri = options.redirectUri;
    if (options?.postLogoutRedirectUri) msalConfig.auth.postLogoutRedirectUri = options.postLogoutRedirectUri;
    if (options?.cacheLocation) msalConfig.cache = { ...msalConfig.cache, cacheLocation: options.cacheLocation };
    if (options?.loginScopes) loginRequest.scopes = options.loginScopes;
    silentRedirectUri = options?.silentRedirectUri;

    msalConfig.system.loggerOptions = {
        logLevel: msal.LogLevel.Warning
    }
    msalInstance = await msal.createStandardPublicClientApplication(msalConfig);

    msalInstance.addEventCallback((event) => {
        if (event.eventType === msal.EventType.LOGIN_SUCCESS && event.payload) {
            const payload = event.payload as msal.AuthenticationResult;
            const account = payload.account;
            msalInstance.setActiveAccount(account);
            window.dispatchEvent(new Event(AUTH_RECOVERED_EVENT));
        }
        else if (
            event.eventType === msal.EventType.ACQUIRE_TOKEN_SUCCESS &&
            (event.interactionType === msal.InteractionType.Redirect ||
                event.interactionType === msal.InteractionType.Popup ||
                event.interactionType === msal.InteractionType.Silent)
        ) {
            // Include Silent: when auth is brought back up to date by a background
            // silent token renewal (not an interactive redirect/popup), any query
            // that errored during the auth window must still be recovered. The
            // listener (MooApp) only refetches errored queries, so firing this on
            // every silent success is a no-op when nothing is stuck.
            window.dispatchEvent(new Event(AUTH_RECOVERED_EVENT));
        }
    });

    // Account selection logic is app dependent. Adjust as needed for different use cases.
    const accounts = msalInstance.getAllAccounts();
    if (!msalInstance.getActiveAccount() && accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
    }

    return msalInstance;
}

export default getMsalInstance;
