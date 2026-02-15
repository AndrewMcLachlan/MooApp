import classNames from "classnames";
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    bg?: string;
    pill?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<BadgeProps>>(
    ({ bg = "primary", pill, className, children, ...rest }, ref) => {
        const classes = classNames(
            "badge",
            bg && `bg-${bg}`,
            pill && "rounded-pill",
            className,
        );

        return (
            <span ref={ref} className={classes} {...rest}>
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";
