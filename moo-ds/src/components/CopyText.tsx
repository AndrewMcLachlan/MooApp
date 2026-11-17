import React from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

// Must stay async: it turns a missing Clipboard API (e.g. an insecure page) into a rejection, so the error toast shows.
const copy = async (text: string) => navigator.clipboard.writeText(text);

/**
 * Inline text that copies a value to the clipboard when clicked, confirming with a toast.
 */
export const CopyText: React.FC<CopyTextProps> = ({ text, children, className }) => (
    <button
        type="button"
        className={classNames("copy-text", className)}
        title={`Copy ${text}`}
        onClick={() => toast.promise(copy(text), { success: `Copied ${text}`, error: `Couldn't copy ${text}` })}
    >
        {children ?? text}
    </button>
);

CopyText.displayName = "CopyText";

export interface CopyTextProps {
    /**
     * The value copied to the clipboard.
     */
    text: string;

    /**
     * What to show. Defaults to the text being copied.
     */
    children?: React.ReactNode;

    className?: string;
}
