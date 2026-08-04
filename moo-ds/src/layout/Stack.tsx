import classNames from "classnames";
import type { ElementType, HTMLAttributes, PropsWithChildren, Ref } from "react";

export interface StackProps extends HTMLAttributes<HTMLElement> {
    as?: ElementType;
    ref?: Ref<HTMLElement>;
}

/** A vertical run of children with a consistent gap between them. */
export const Stack: React.FC<PropsWithChildren<StackProps>> = ({ as: Tag = "div", children, className, ...props }) => (
    <Tag className={classNames("stack", className)} {...props}>
        {children}
    </Tag>
);

Stack.displayName = "Stack";
