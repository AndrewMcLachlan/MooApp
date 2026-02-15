import classNames from "classnames";
import React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "danger" | "warning" | "success" | "info" | "primary";
    dismissible?: boolean;
    show?: boolean;
    onClose?: (...args: any[]) => void;
}

const AlertHeading: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLHeadingElement>>> = ({ className, children, ...rest }) => (
    <h4 className={classNames("alert-heading", className)} {...rest}>{children}</h4>
);

AlertHeading.displayName = "Alert.Heading";

const AlertComponent = React.forwardRef<HTMLDivElement, React.PropsWithChildren<AlertProps>>(
    ({ variant = "primary", dismissible, show = true, onClose, className, children, ...rest }, ref) => {
        if (!show) return null;

        const classes = classNames(
            "alert",
            variant && `alert-${variant}`,
            dismissible && "alert-dismissible",
            className,
        );

        return (
            <div ref={ref} className={classes} role="alert" {...rest}>
                {children}
                {dismissible && (
                    <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                )}
            </div>
        );
    }
);

AlertComponent.displayName = "Alert";

export const Alert = Object.assign(AlertComponent, {
    Heading: AlertHeading,
});
