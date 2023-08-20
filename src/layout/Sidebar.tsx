import { Button, Nav } from "react-bootstrap";
import { Link, NavLink, NavLinkProps } from "react-router-dom";
import { NavItem } from "../models";
import { useLayout } from "providers";
import { LinkContainer } from "react-router-bootstrap";

export type SidebarComponent = React.FC<React.PropsWithChildren<SidebarProps>>;

export const Sidebar: SidebarComponent = ({ children, ...props }) => {

    const layout = useLayout();

    return (
        <Nav className="flex-column sidebar">
            {renderMenu(props.navItems)}
            {layout.secondaryNav.length > 0 &&
                <>
                    <Nav.Item className="divider" />
                    {renderMenu(layout.secondaryNav)}
                </>
            }
        </Nav>
    );
};

const renderMenu = (navItems: NavItem[]) => {

    const items: React.ReactNode[] = navItems.map((navItem, index) => {

        const image = typeof navItem.image === "string" ? <img src={navItem.image} alt="" /> : navItem.image ?? <svg></svg>;

        if (navItem.route) {
            return <NavLink className={({isActive}) => `nav-link ${isActive ? "active" : ""}`} to={navItem.route} key={`route${index}`} onClick={navItem.onClick}>{image}{navItem.text}</NavLink>;
        }
        else if (navItem.onClick) {
            return <Nav.Link as={Button} key={`click${index}`} variant="link" onClick={navItem.onClick}>{image}{navItem.text}</Nav.Link>;
        }
        else{
            throw "Invalid nav item, specify a route and/or an onClick handler.";
        }
    });

    return items;

}

Sidebar.defaultProps = {
    navItems: [],
};

export interface SidebarProps {
    navItems?: NavItem[],
}
