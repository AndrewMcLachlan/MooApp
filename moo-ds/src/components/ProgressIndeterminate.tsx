import classNames from "classnames";
import React from "react";

export interface ProgressIndeterminateProps extends React.HTMLAttributes<HTMLDivElement> {
    /** "edge" pins the bar flush to the top of the nearest positioned ancestor. */
    variant?: "inline" | "edge";
}

/**
 * A thin indeterminate line, for a panel that is refetching while its data is
 * still on screen. Pair the "edge" variant with `is-refreshing` on the host so
 * the body recedes rather than being replaced -- that is the point of it.
 */
export const ProgressIndeterminate = React.forwardRef<HTMLDivElement, ProgressIndeterminateProps>(
    ({ variant = "inline", className, "aria-label": ariaLabel = "Loading", ...rest }, ref) => (
        <div
            ref={ref}
            className={classNames(
                "progress-indeterminate",
                variant === "edge" && "progress-indeterminate-edge",
                className,
            )}
            role="progressbar"
            aria-busy="true"
            aria-label={ariaLabel}
            {...rest}
        />
    )
);

ProgressIndeterminate.displayName = "ProgressIndeterminate";
