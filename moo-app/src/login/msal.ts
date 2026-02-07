import * as msal from "@azure/msal-browser";

const msalConfig: msal.Configuration = {
    auth: {
        clientId: "",
        authority: "https://login.microsoftonline.com/30efefb9-9034-4e0c-8c69-17f4578f5924",
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
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


let msalInstance: msal.IPublicClientApplication;

const getMsalInstance = async (clientId: string): Promise<msal.IPublicClientApplication> => {
    if (msalInstance) return msalInstance;

    msalConfig.auth.clientId = clientId;
    msalConfig.system.loggerOptions = {
        logLevel: msal.LogLevel.Warning
    }
    msalInstance = await msal.createStandardPublicClientApplication(msalConfig);

    msalInstance.handleRedirectPromise(options) =>

    msalInstance.addEventCallback((event) => {
        if (event.eventType === msal.EventType.LOGIN_SUCCESS && event.payload) {
            const payload = event.payload as msal.AuthenticationResult;
            const account = payload.account;
            msalInstance.setActiveAccount(account);
        }
        else if (event.eventType === msal.EventType.ACQUIRE_TOKEN_FAILURE) {
            msalInstance.loginRedirect(loginRequest);
        }
    });

    // Account selection logic is app dependent. Adjust as needed for different use cases.
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
    }

    return msalInstance;
}

export default getMsalInstance; 