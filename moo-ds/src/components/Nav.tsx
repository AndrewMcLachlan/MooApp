import classNames from "classnames";
import React from "react";

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    variant?: "tabs" | "pills";
    column?: boolean;
}

export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}

export interface NavLinkProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    active?: boolean;
    disabled?: boolean;
    href?: string;
    eventKey?: string;
    variant?: string;
}

const NavItem = React.forwardRef<HTMLElement, React.PropsWithChildren<NavItemProps>>(
    ({ as: Tag = "div", className, children, ...rest }, ref) => (
        <Tag ref={ref} className={classNames("nav-item", className)} {...rest}>
            {children}
        </Tag>
    )
);

NavItem.displayName = "Nav.Item";

const NavLink = React.forwardRef<HTMLElement, React.PropsWithChildren<NavLinkProps>>(
    ({ as: Tag = "a", active, disabled, className, children, ...rest }, ref) => (
        <Tag
            ref={ref}
            className={classNames("nav-link", active && "active", disabled && "disabled", className)}
            {...rest}
        >
            {children}
        </Tag>
    )
);

NavLink.displayName = "Nav.Link";

const NavComponent = React.forwardRef<HTMLElement, React.PropsWithChildren<NavProps>>(
    ({ as: Tag = "nav", variant, column, className, children, ...rest }, ref) => (
        <Tag ref={ref} className={classNames("nav", variant && `nav-${variant}`, column && "nav-column", className)} {...rest}>
            {children}
        </Tag>
    )
);

NavComponent.displayName = "Nav";

export const Nav = Object.assign(NavComponent, {
    Item: NavItem,
    Link: NavLink,
});
