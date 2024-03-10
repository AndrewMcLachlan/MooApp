import React, { ElementType, ReactNode, isValidElement } from "react";
import { Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { NavItem } from "models";

export const renderMenu = (navItems: (NavItem | ReactNode)[], as: ElementType = React.Fragment) => {

    const As = as;

    const items: React.ReactNode[] = navItems.map((item, index) => {

        if (isValidElement(item)) {
            return <React.Fragment key={`node${index}`}>{item}</React.Fragment>;
        };

        const navItem = item as NavItem;

        const image = typeof navItem.image === "string" ? <img src={navItem.image} alt="" /> : navItem.image ?? <></>;

        if (navItem.route) {
            return <As><NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to={navItem.route} key={`route${index}`} onClick={navItem.onClick} title={navItem.text}>{image}<span>{navItem.text}</span></NavLink></As>;
        }
        else if (navItem.onClick) {
            return <As><Nav.Link as={Button} key={`click${index}`} variant="link" onClick={navItem.onClick} title={navItem.text}>{image}<span>{navItem.text}</span></Nav.Link></As>;
        }
        else {
            throw "Invalid nav item, specify a route and/or an onClick handler.";
        }
    });

    return items;
};
