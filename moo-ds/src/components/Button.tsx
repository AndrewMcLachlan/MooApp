import classNames from "classnames";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline-primary" | "secondary" | "outline-secondary" | "danger" | "outline-danger" | "warning" | "outline-warning" | "success" | "outline-success" | "link";
    size?: "sm" | "lg";
    as?: React.ElementType;
    active?: boolean;
    href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(
    ({ variant = "primary", size, as, active, className, children, type = "button", ...rest }, ref) => {
        const Tag = as || "button";
        const classes = classNames(
            "btn",
            variant && `btn-${variant}`,
            size && `btn-${size}`,
            active && "active",
            className,
        );

        return (
            <Tag ref={ref} className={classes} type={Tag === "button" ? type : undefined} {...rest}>
                {children}
            </Tag>
        );
    }
);

Button.displayName = "Button";
