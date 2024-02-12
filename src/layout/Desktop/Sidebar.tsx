import Chevron from "../../assets/chevron.svg";

import classNames from "classnames";
import { useLocalStorage } from "hooks";
import { useLayout } from "providers";
import React, { ReactNode, isValidElement } from "react";
import { Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { NavItem } from "../../models";
import { SidebarComponent } from "layout/Types";

export const Sidebar: SidebarComponent = ({ children, ...props }) => {

    const layout = useLayout();

    const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapse", false);

    const collapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={classNames("sidebar", collapsed ? "collapsed" : "", "d-none d-lg-flex")}>
            <Nav className="flex-column">
                {renderMenu(props.navItems)}
                {layout.secondaryNav.length > 0 &&
                    <>
                        <Nav.Item className="divider" />
                        {renderMenu(layout.secondaryNav)}
                    </>
                }
            </Nav>
            <div className="sidebar-collapse" onClick={collapse}>
                <Chevron />
            </div>
        </div>
    );
};

const renderMenu = (navItems: (NavItem | ReactNode)[]) => {

    const items: React.ReactNode[] = navItems.map((item, index) => {

        if (isValidElement(item)) {
            return <React.Fragment key={`node${index}`}>{item}</React.Fragment>;
        };

        const navItem = item as NavItem;

        const image = typeof navItem.image === "string" ? <img src={navItem.image} alt="" /> : navItem.image ?? <svg></svg>;

        if (navItem.route) {
            return <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to={navItem.route} key={`route${index}`} onClick={navItem.onClick} title={navItem.text}>{image}<span>{navItem.text}</span></NavLink>;
        }
        else if (navItem.onClick) {
            return <Nav.Link as={Button} key={`click${index}`} variant="link" onClick={navItem.onClick} title={navItem.text}>{image}<span>{navItem.text}</span></Nav.Link>;
        }
        else {
            throw "Invalid nav item, specify a route and/or an onClick handler.";
        }
    });

    return items;

}

Sidebar.defaultProps = {
    navItems: [],
};