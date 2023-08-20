import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NavItem } from "../models";
import { useLayout } from "providers";

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

const renderMenu = (menuItems: NavItem[]) => {

    const items: React.ReactNode[] = [];

    let keysuffix = 0;

    for (const menuItem of menuItems) {

        const image = typeof menuItem.image === "string" ? <img src={menuItem.image} alt="" /> : menuItem.image ?? <svg></svg>;


        if (menuItem.route) {
            items.push(<Nav.Link as={Link} key={"route" + keysuffix.toString()} to={menuItem.route} onClick={() => menuItem.onClick && menuItem.onClick()}>{image}{menuItem.text}</Nav.Link>);
        }
        else if (menuItem.onClick) {
            items.push(<Nav.Link as={Button} key={"click" + keysuffix.toString()} variant="link" onClick={() => menuItem.onClick!()}>{image}{menuItem.text}</Nav.Link>);
        }

        keysuffix++;
    }

    return items;

}

Sidebar.defaultProps = {
    navItems: [],
};

export interface SidebarProps {
    navItems?: NavItem[],
}
