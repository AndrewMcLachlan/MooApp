import classNames from "classnames";
import React from "react";
import { NavItem } from "../models";
import { useLink } from "../providers";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    breadcrumbs?: NavItem[];
    as?: React.ElementType;
    label?: string;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
    active?: boolean;
    linkAs?: React.ElementType;
    linkProps?: Record<string, any>;
    href?: string;
}

const BreadcrumbItem: React.FC<React.PropsWithChildren<BreadcrumbItemProps>> = ({ active, linkAs, linkProps, href, className, children, ...rest }) => {
    const Tag = linkAs || "a";
    return (
        <li className={classNames("breadcrumb-item", active && "active", className)} {...rest}>
            {active ? children : <Tag href={href} {...linkProps}>{children}</Tag>}
        </li>
    );
};

BreadcrumbItem.displayName = "Breadcrumb.Item";

const BreadcrumbComponent: React.FC<React.PropsWithChildren<BreadcrumbProps>> = ({ breadcrumbs = [], as: Tag = "nav", label = "breadcrumb", className, children, ...rest }) => {

    const Link = useLink();

    return (
        <Tag aria-label={label} {...rest}>
            <ol className={classNames("breadcrumb", className)}>
                <BreadcrumbItem linkProps={{ to: "/" }} linkAs={Link}>Home</BreadcrumbItem>
                {breadcrumbs.map((item, index) =>
                    <BreadcrumbItem key={index} linkProps={{ to: item.route }} linkAs={Link}>{item.text}</BreadcrumbItem>
                )}
                {children}
            </ol>
        </Tag>
    );
};

BreadcrumbComponent.displayName = "Breadcrumb";

export const Breadcrumb = Object.assign(BreadcrumbComponent, {
    Item: BreadcrumbItem,
});
