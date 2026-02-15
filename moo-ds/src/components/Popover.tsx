import classNames from "classnames";
import React from "react";

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    placement?: "top" | "bottom" | "left" | "right";
}

export interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
}

export interface PopoverBodyProps extends React.HTMLAttributes<HTMLDivElement> {
}

const PopoverHeader: React.FC<React.PropsWithChildren<PopoverHeaderProps>> = ({ as: Tag = "h3", className, children, ...rest }) => (
    <Tag className={classNames("popover-header", className)} {...rest}>
        {children}
    </Tag>
);

PopoverHeader.displayName = "Popover.Header";

const PopoverBody: React.FC<React.PropsWithChildren<PopoverBodyProps>> = ({ className, children, ...rest }) => (
    <div className={classNames("popover-body", className)} {...rest}>
        {children}
    </div>
);

PopoverBody.displayName = "Popover.Body";

const PopoverComponent = React.forwardRef<HTMLDivElement, React.PropsWithChildren<PopoverProps>>(
    ({ id, placement = "bottom", className, children, ...rest }, ref) => (
        <div ref={ref} id={id} className={classNames("popover", `popover-${placement}`, className)} role="tooltip" {...rest}>
            {children}
        </div>
    )
);

PopoverComponent.displayName = "Popover";

export const Popover = Object.assign(PopoverComponent, {
    Header: PopoverHeader,
    Body: PopoverBody,
});
