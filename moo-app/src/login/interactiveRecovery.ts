import type { IPublicClientApplication } from "@azure/msal-browser";
import { loginRequest } from "./msal";

/**
 * How far automatic interactive recovery has gone in this tab:
 *
 * - `tokenRedirect`: an `acquireTokenRedirect` has been started.
 * - `loginRedirect`: a fresh `loginRedirect` has been started, either
 *   automatically after a token redirect did not fix things, or by the user
 *   from the session-expired prompt.
 *
 * A redirect discards the page and all in-memory state with it, so the stage is
 * held in sessionStorage: that is what bounds *sequential* automatic redirects
 * to two per tab. It is scoped to the tab so one tab recovering does not
 * consume another's attempts, and it is cleared by the next successful silent
 * token acquisition.
 */
export type RecoveryStage = "tokenRedirect" | "loginRedirect";

const recoveryStageKey = "mooappInteractiveRecoveryAttempted";

// sessionStorage throws where storage is blocked -- private browsing, some
// embedded webviews, a restrictive cookie policy. Authentication must not be
// the thing that breaks there, so each access degrades to "no stage".
export const getRecoveryStage = (): RecoveryStage | undefined => {
    try {
        const value = sessionStorage.getItem(recoveryStageKey);
        if (value === null) return undefined;
        return value === "loginRedirect" ? "loginRedirect" : "tokenRedirect";
    } catch {
        return undefined;
    }
};

export const setRecoveryStage = (stage: RecoveryStage): void => {
    try {
        sessionStorage.setItem(recoveryStageKey, stage);
    } catch {
        // Storage unavailable; the in-memory guard still bounds concurrent callers.
    }
};

export const clearRecoveryStage = (): void => {
    try {
        sessionStorage.removeItem(recoveryStageKey);
    } catch {
        // Nothing to clear if it could never be written.
    }
};

let sessionExpired = false;
const sessionExpiredListeners = new Set<() => void>();

const setSessionExpired = (value: boolean): void => {
    if (sessionExpired === value) return;
    sessionExpired = value;
    sessionExpiredListeners.forEach((listener) => listener());
};

/** Whether automatic recovery is exhausted and the user has to sign in again. */
export const isSessionExpired = (): boolean => sessionExpired;

export const subscribeSessionExpired = (listener: () => void): (() => void) => {
    sessionExpiredListeners.add(listener);
    return () => { sessionExpiredListeners.delete(listener); };
};

/** Automatic recovery is exhausted: ask the user to sign in again. */
export const markSessionExpired = (): void => setSessionExpired(true);

/** Silent acquisition works again, so recovery is no longer under way. */
export const recoverySucceeded = (): void => {
    clearRecoveryStage();
    setSessionExpired(false);
};

export const interactiveScopes = (scopes: string[]): string[] =>
    Array.from(new Set([...(loginRequest.scopes ?? []), ...scopes]));

/**
 * Starts a fresh interactive sign-in. `selectAccount` shows the account picker,
 * which a user-initiated sign-in wants (the cached account may be the wrong
 * one) and an automatic one does not (an existing Entra session completes it
 * without a click).
 */
export const signInAgain = async (instance: IPublicClientApplication, scopes: string[], selectAccount: boolean): Promise<void> => {
    const previousStage = getRecoveryStage();
    setRecoveryStage("loginRedirect");
    try {
        await instance.loginRedirect({
            ...loginRequest,
            scopes: interactiveScopes(scopes),
            ...(selectAccount ? { prompt: "select_account" } : {}),
        });
    } catch (error) {
        // Nothing navigated, so the attempt was not spent.
        if (previousStage) setRecoveryStage(previousStage);
        else clearRecoveryStage();
        throw error;
    }
};
