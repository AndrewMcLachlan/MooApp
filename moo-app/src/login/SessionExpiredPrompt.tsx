import { useState, useSyncExternalStore } from "react";
import { useMsal } from "@azure/msal-react";
import { Button, Modal } from "@andrewmclachlan/moo-ds";
import { isSessionExpired, signInAgain, subscribeSessionExpired } from "./interactiveRecovery";

export interface SessionExpiredPromptProps {
    scopes: string[];
}

/**
 * Shown once automatic recovery is exhausted, so a user whose sign-in has
 * lapsed always has a way back that does not depend on knowing to sign out or
 * open a new tab.
 */
export const SessionExpiredPrompt: React.FC<SessionExpiredPromptProps> = ({ scopes }) => {

    const { instance } = useMsal();
    const expired = useSyncExternalStore(subscribeSessionExpired, isSessionExpired, () => false);
    const [signingIn, setSigningIn] = useState(false);

    const onSignIn = async () => {
        setSigningIn(true);
        try {
            await signInAgain(instance, scopes, true);
        } catch (error) {
            console.error("Could not start sign-in.", error);
            setSigningIn(false);
        }
    };

    if (!expired) return null;

    return (
        <Modal show aria-labelledby="mooapp-session-expired-title">
            <Modal.Header>
                <Modal.Title id="mooapp-session-expired-title">Your session has expired</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Sign in again to carry on. You'll come back to this page.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onSignIn} loading={signingIn}>Sign in again</Button>
            </Modal.Footer>
        </Modal>
    );
};
