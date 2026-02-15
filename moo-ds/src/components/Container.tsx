import classNames from "classnames";
import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
    fluid?: boolean;
    as?: React.ElementType;
}

export const Container = React.forwardRef<HTMLElement, React.PropsWithChildren<ContainerProps>>(
    ({ fluid, as: Tag = "div", className, children, ...rest }, ref) => (
        <Tag ref={ref} className={classNames(fluid ? "container-fluid" : "container", className)} {...rest}>
            {children}
        </Tag>
    )
);

Container.displayName = "Container";
