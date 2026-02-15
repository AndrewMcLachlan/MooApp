import classNames from "classnames";
import React from "react";

export interface RowProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}

export const Row = React.forwardRef<HTMLElement, React.PropsWithChildren<RowProps>>(
    ({ as: Tag = "div", className, children, ...rest }, ref) => (
        <Tag ref={ref} className={classNames("row", className)} {...rest}>
            {children}
        </Tag>
    )
);

Row.displayName = "Row";
