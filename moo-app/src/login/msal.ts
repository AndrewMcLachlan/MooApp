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
 * Options for overriding parts of the MSAL {@link msal.Configuration} at
 * instance-creation time. All properties are optional and default to the
 * historical behaviour, so existing consuming apps are unaffected.
 */
export interface MsalOptions {
    /**
     * The URI that Azure AD redirects to after authentication. This is also the
     * page MSAL loads inside the hidden iframe used for silent token renewal.
     *
     * Defaults to `window.location.origin` (the app's home page).
     *
     * When the default is used, every silent token renewal re-boots the entire
     * SPA inside the hidden iframe, which MSAL detects and aborts with
     * `BrowserAuthError: block_iframe_reload` (see issue #607). To avoid this,
     * point this at a lightweight page that does not boot the SPA — e.g. a
     * `blank.html` served from your app's `public/` folder:
     *
     * ```ts
     * <MooApp redirectUri={`${window.location.origin}/blank.html`} ... />
     * ```
     *
     * NOTE: the URI must also be registered as a redirect (reply) URI on the
     * app's Azure AD registration, otherwise authentication will fail. Interactive
     * login still returns the user to the originally requested route — MSAL v5
     * navigates back to the login-request URL by default.
     */
    redirectUri?: string;
}

let msalInstance: msal.IPublicClientApplication;

const getMsalInstance = async (clientId: string, options?: MsalOptions): Promise<msal.IPublicClientApplication> => {
    if (msalInstance) return msalInstance;

    msalConfig.auth.clientId = clientId;
    if (options?.redirectUri) {
        msalConfig.auth.redirectUri = options.redirectUri;
    }
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
