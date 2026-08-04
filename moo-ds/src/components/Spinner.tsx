import classNames from "classnames";
import React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: "border" | "comet";
    size?: "sm";
    as?: React.ElementType;
    /** Ms to wait before appearing, so short fetches never flash it. 0 to render immediately. */
    delay?: number;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ animation = "comet", size, as: Tag = "div", className, delay = 300, ...rest }, ref) => {
        const [visible, setVisible] = React.useState(delay === 0);

        React.useEffect(() => {
            if (delay === 0) {
                setVisible(true);
                return undefined;
            }
            const timeout = setTimeout(() => setVisible(true), delay);
            return () => clearTimeout(timeout);
        }, [delay]);

        if (!visible) return null;

        const base = animation === "border" ? "spinner-border" : "spinner-comet";

        const classes = classNames(base, size && `${base}-${size}`, className);

        return (
            <Tag ref={ref} className={classes} role="status" {...rest}>
                <span className="visually-hidden">Loading...</span>
            </Tag>
        );
    }
);

Spinner.displayName = "Spinner";
