import Chevron from "../../assets/chevron.svg";

import classNames from "classnames";
import { useLocalStorage } from "../../hooks";
import { useLayout } from "../../providers";
import { Nav } from "react-bootstrap";
import { SidebarComponent } from "../Types";
import { renderMenu } from "../../utils";

export const Sidebar: SidebarComponent = ({ children, ...props }) => {

    const layout = useLayout();

    return (
        <div id="sidebar" className={classNames("sidebar", layout.sidebarCollapsed ? "collapsed" : "", "d-none d-lg-flex")}>
            <Nav className="flex-column">
                {renderMenu(props.navItems)}
                {layout.secondaryNav.length > 0 &&
                    <>
                        <Nav.Item className="divider" />
                        {renderMenu(layout.secondaryNav)}
                    </>
                }
                <div className="spacer" />
            </Nav>
        </div>
    );
};

Sidebar.defaultProps = {
    navItems: [],
};
