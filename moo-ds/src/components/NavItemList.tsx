import { isValidElement } from "react";
import { useNavLink } from "../providers";
import React from "react";
import { NavItem } from "../models";
import { Button, Nav } from "react-bootstrap";

export const NavItemList : React.FC<NavItemListProps> = ({ navItems, as, role, onClick }) => {
    
    const As = as;
    const NavLink = useNavLink();

    const items: React.ReactNode[] = navItems.map((item, index) => {

        if (isValidElement(item)) {
            return <React.Fragment key={`node${index}`}>{item}</React.Fragment>;
        };

        const navItem = item as NavItem;

        const image = typeof navItem.image === "string" ? <img src={navItem.image} alt="" /> : navItem.image ?? <></>;

        // TODO: Allow prevention of navItem.onClick in custom event handler.
        const onNavItemClick = onClick ? () =>  { onClick(navItem); navItem?.onClick(); } : navItem.onClick;

        if (navItem.route) {
            return <As key={`route${index}`}><NavLink cl className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to={navItem.route} onClick={onNavItemClick} title={navItem.text} role={role}>{image}<span>{navItem.text}</span></NavLink></As>;
        }
        else if (navItem.onClick) {
            return <As key={`click${index}`}><Nav.Link as={Button} variant="link" onClick={onNavItemClick} title={navItem.text} role={role}>{image}<span>{navItem.text}</span></Nav.Link></As>;
        }
        else {
            throw "Invalid nav item, specify a route and/or an onClick handler.";
        }
    });

    return <>{items}</>;
}

export interface NavItemListProps {
    navItems: (NavItem | React.ReactNode)[];
    as?: React.ElementType;
    role?: string;
    onClick?: (navItem: NavItem) => void;
}