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
 * Optional overrides for the MSAL configuration. Any value left unset falls
 * back to the framework default, so existing single-tenant consumers are
 * unaffected while multi-tenant / differently-hosted apps can configure the
 * authority, redirect URIs, cache location and login scopes without forking.
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
}

let msalInstance: msal.IPublicClientApplication;

const getMsalInstance = async (clientId: string, options?: MsalOptions): Promise<msal.IPublicClientApplication> => {
    if (msalInstance) return msalInstance;

    msalConfig.auth.clientId = clientId;
    if (options?.authority) msalConfig.auth.authority = options.authority;
    if (options?.redirectUri) msalConfig.auth.redirectUri = options.redirectUri;
    if (options?.postLogoutRedirectUri) msalConfig.auth.postLogoutRedirectUri = options.postLogoutRedirectUri;
    if (options?.cacheLocation) msalConfig.cache = { ...msalConfig.cache, cacheLocation: options.cacheLocation };
    if (options?.loginScopes) loginRequest.scopes = options.loginScopes;

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
