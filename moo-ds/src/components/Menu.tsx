import classNames from "classnames";
import React, { type PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger } from "./OverlayTrigger";
import { Popover } from "./Popover";
import { useLink } from "../providers/LinkProvider";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    trigger: React.ReactElement;
    placement?: "top" | "bottom" | "left" | "right";
    /** Identifies whose menu this is, above the items. */
    header?: React.ReactNode;
}

export interface MenuItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onClick"> {
    icon?: React.ReactNode;
    /** Present makes the item a toggle: it reports a checked state and shows a tick. */
    checked?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    /** Renders the item's content as a link, so it keeps middle-click and
        open-in-new-tab. Routing comes from LinkProvider, so the menu stays
        router-agnostic. */
    to?: string;
}

/* useLink throws outside a LinkProvider, so it is called from a component that
   renders only when there is a destination. A Menu with no links works with no
   provider in the tree. */
const MenuLink: React.FC<PropsWithChildren<{ to: string }>> = ({ to, children }) => {
    const Link = useLink();
    return <Link to={to}>{children}</Link>;
};

const MenuItem: React.FC<PropsWithChildren<MenuItemProps>> = ({ icon, checked, disabled, onClick, to, className, children, ...rest }) => {

    const content = (
        <>
            <span className="menu-item-icon">{icon}</span>
            <span className="menu-item-label">{children}</span>
            {checked && <FontAwesomeIcon icon="check" className="menu-item-check" />}
        </>
    );

    return (
        <li
            role={checked === undefined ? "menuitem" : "menuitemcheckbox"}
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            className={classNames("menu-item", disabled ? "disabled" : "clickable", className)}
            onClick={disabled ? undefined : onClick}
            {...rest}
        >
            {to && !disabled ? <MenuLink to={to}>{content}</MenuLink> : content}
        </li>
    );
};

MenuItem.displayName = "Menu.Item";

const MenuDivider: React.FC = () => <li className="divider" role="separator" />;

MenuDivider.displayName = "Menu.Divider";

const MenuComponent: React.FC<PropsWithChildren<MenuProps>> = ({ id, trigger, placement = "bottom", header, className, children, ...rest }) => (
    <OverlayTrigger
        trigger="click"
        placement={placement}
        rootClose
        containerPadding={10}
        overlay={(close: () => void) => (
            <Popover id={id} className={classNames("menu-popover", className)} {...rest}>
                {header && <Popover.Header as="div" className="menu-header">{header}</Popover.Header>}
                <Popover.Body>
                    <ul role="menu" onClick={close}>{children}</ul>
                </Popover.Body>
            </Popover>
        )}
    >
        {trigger}
    </OverlayTrigger>
);

MenuComponent.displayName = "Menu";

export const Menu = Object.assign(MenuComponent, {
    Item: MenuItem,
    Divider: MenuDivider,
});
