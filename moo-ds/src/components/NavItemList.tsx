import { isValidElement } from "react";
import { useNavLink } from "../providers";
import React from "react";
import { NavItem } from "../models";
import { Button, Nav } from "react-bootstrap";

export const NavItemList: React.FC<NavItemListProps> = ({ navItems, as = React.Fragment, role, onClick }) => {

    const As = as;
    const NavLink = useNavLink();

    const [selected, setSelected] = React.useState<NavItem | null>(null);

    const onNavItemClick = (e: React.MouseEvent<HTMLElement>, navItem: NavItem) => {
        setSelected(navItem);
        if (onClick) {
            onClick(e, navItem);
        }

        navItem?.onClick(e);
    }

    const items: React.ReactNode[] = navItems.map((item, index) => {

        if (isValidElement(item)) {
            return <React.Fragment key={`node${index}`}>{item}</React.Fragment>;
        };

        const navItem = item as NavItem;

        const image = typeof navItem.image === "string" ? <img src={navItem.image} alt="" /> : navItem.image ?? <></>;

        if (navItem.route) {
            return <As key={`route${index}`}><NavLink className={({ isActive }) => `nav-link ${(!selected?.id || selected?.id === navItem.id) && isActive ? "active" : ""}`} to={navItem.route} onClick={onNavItemClick} title={navItem.text} role={role}>{image}<span>{navItem.text}</span></NavLink></As >;
        }
        else if (navItem.onClick) {
            return <As key={navItem.id ?? `click${index}`}><Nav.Link as={Button} className={selected?.id && selected?.id === navItem.id ? "active" : ""} variant="link" onClick={(e) => onNavItemClick(e, navItem)} title={navItem.text} role={role}>{image}<span>{navItem.text}</span></Nav.Link></As>;
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
    onClick?: (e: React.MouseEvent<HTMLElement>, navItem: NavItem) => void;
}