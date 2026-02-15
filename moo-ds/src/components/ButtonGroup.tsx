import classNames from "classnames";
import React from "react";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, React.PropsWithChildren<ButtonGroupProps>>(
    ({ className, children, role = "group", ...rest }, ref) => (
        <div ref={ref} className={classNames("btn-group", className)} role={role} {...rest}>
            {children}
        </div>
    )
);

ButtonGroup.displayName = "ButtonGroup";
