import classNames from "classnames";
import React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: "border" | "grow";
    size?: "sm";
    as?: React.ElementType;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ animation = "border", size, as: Tag = "div", className, ...rest }, ref) => {
        const classes = classNames(
            animation === "grow" ? "spinner-grow" : "spinner-border",
            size && (animation === "grow" ? "spinner-grow-sm" : "spinner-border-sm"),
            className,
        );

        return (
            <Tag ref={ref} className={classes} role="status" {...rest}>
                <span className="visually-hidden">Loading...</span>
            </Tag>
        );
    }
);

Spinner.displayName = "Spinner";
