import React from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

/**
 * Inline text that copies a value to the clipboard when clicked, confirming with a toast.
 */
export const CopyText: React.FC<CopyTextProps> = ({ text, children, className }) => (
    <button
        type="button"
        className={classNames("copy-text", className)}
        title={`Copy ${text}`}
        onClick={() => toast.promise(navigator.clipboard.writeText(text), { success: `Copied ${text}`, error: `Couldn't copy ${text}` })}
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
