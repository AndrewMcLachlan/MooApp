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
 * Options for overriding parts of the MSAL configuration at instance-creation
 * time. All properties are optional and default to the historical behaviour, so
 * existing consuming apps are unaffected.
 */
export interface MsalOptions {
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
     * ```ts
     * <MooApp silentRedirectUri={`${window.location.origin}/blank.html`} ... />
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

let silentRedirectUri: string | undefined;

/**
 * The redirect URI to apply to silent token requests, or `undefined` to use the
 * MSAL default. Configured via {@link MsalOptions.silentRedirectUri}.
 */
export const getSilentRedirectUri = (): string | undefined => silentRedirectUri;

const getMsalInstance = async (clientId: string, options?: MsalOptions): Promise<msal.IPublicClientApplication> => {
    if (msalInstance) return msalInstance;

    msalConfig.auth.clientId = clientId;
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
            (event.interactionType === msal.InteractionType.Redirect || event.interactionType === msal.InteractionType.Popup)
        ) {
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
