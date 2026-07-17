import classNames from "classnames";
import React from "react";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline-primary" | "secondary" | "outline-secondary" | "danger" | "outline-danger" | "warning" | "outline-warning" | "success" | "outline-success" | "link";
    size?: "sm" | "lg";
    as?: React.ElementType;
    active?: boolean;
    href?: string;
    /** Show an inline spinner and mark the button busy (also disables it). */
    loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(
    ({ variant = "primary", size, as, active, loading = false, disabled, className, children, type = "button", onClick, ...rest }, ref) => {
        const Tag = as || "button";
        const isDisabled = loading || disabled;
        const classes = classNames(
            "btn",
            variant && `btn-${variant}`,
            size && `btn-${size}`,
            active && "active",
            loading && "btn-loading",
            className,
        );

        // A native disabled <button> ignores clicks, but other `as` elements
        // (e.g. an anchor) do not — intercept so "loading disables" holds regardless.
        const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
            if (isDisabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            onClick?.(e);
        };

        return (
            <Tag
                ref={ref}
                className={classes}
                type={Tag === "button" ? type : undefined}
                disabled={Tag === "button" ? isDisabled : undefined}
                aria-disabled={isDisabled || undefined}
                aria-busy={loading || undefined}
                onClick={handleClick}
                {...rest}
            >
                {loading && <Spinner animation="border" size="sm" className="btn-spinner" aria-hidden="true" />}
                {children}
            </Tag>
        );
    }
);

Button.displayName = "Button";
