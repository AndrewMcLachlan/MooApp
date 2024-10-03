
import { SidebarComponent } from "../Types";
import { useLayout } from "../../providers";
import React, { ReactNode, isValidElement } from "react";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { LayoutContext, NavItem } from "../../models";

export const Sidebar: SidebarComponent = ({ navItems = [] }) => {

    const layout = useLayout();

    return (
        <Offcanvas show={layout.showSidebar}>
            <Offcanvas.Header closeButton onHide={() => layout.setShowSidebar(false)} />
            <Offcanvas.Body className="d-lg-none sidebar">
                <Nav className="flex-column ">
                    {renderMenu(layout, navItems)}
                    {layout.secondaryNav.length > 0 &&
                        <>
                            <Nav.Item className="divider" />
                            {renderMenu(layout, layout.secondaryNav)}
                        </>
                    }
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

const renderMenu = (layout: LayoutContext, navItems: (NavItem | ReactNode)[]) => {

    const items: React.ReactNode[] = navItems.map((item, index) => {

        if (isValidElement(item)) {
            return <React.Fragment key={`node${index}`}>{item}</React.Fragment>;
        };

        const navItem = item as NavItem;

        const image = typeof navItem.image === "string" ? <img src={navItem.image} alt="" /> : navItem.image ?? <svg></svg>;

        const onClick = () => { layout.setShowSidebar(false); if (navItem.onClick) { navItem.onClick(); } };

        if (navItem.route) {
            return <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to={navItem.route} key={`route${index}`} onClick={onClick} title={navItem.text}>{image}<span>{navItem.text}</span></NavLink>;
        }
        else if (navItem.onClick) {
            return <Nav.Link as={Button} key={`click${index}`} variant="link" onClick={onClick} title={navItem.text}>{image}<span>{navItem.text}</span></Nav.Link>;
        }
        else {
            throw "Invalid nav item, specify a route and/or an onClick handler.";
        }
    });

    return items;

}
