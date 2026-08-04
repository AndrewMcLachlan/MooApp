import classNames from "classnames";
import React from "react";

export interface RowProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    ref?: React.Ref<HTMLElement>;
}

export const Row: React.FC<React.PropsWithChildren<RowProps>> = ({ as: Tag = "div", className, children, ...rest }) => (
    <Tag className={classNames("row", className)} {...rest}>
        {children}
    </Tag>
)

Row.displayName = "Row";
