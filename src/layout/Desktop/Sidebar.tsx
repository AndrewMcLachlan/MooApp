import Chevron from "../../assets/chevron.svg";

import classNames from "classnames";
import { useLocalStorage } from "hooks";
import { useLayout } from "providers";
import React, { ReactNode, isValidElement } from "react";
import { Button, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { NavItem } from "../../models";
import { SidebarComponent } from "layout/Types";
import { renderMenu } from "utils";

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

Sidebar.defaultProps = {
    navItems: [],
};
