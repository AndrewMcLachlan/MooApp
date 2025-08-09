import classNames from "classnames";
import { useLayout } from "../../providers";
import { Nav } from "react-bootstrap";
import { SidebarComponent } from "../Types";
import { NavItemList } from "@andrewmclachlan/moo-ds";

export const Sidebar: SidebarComponent = ({ navItems = [] }) => {

    const layout = useLayout();

    return (
        <div id="sidebar" className={classNames("sidebar", layout.sidebarCollapsed ? "collapsed" : "", "d-none d-lg-flex")}>
            <Nav className="flex-column">
                <NavItemList navItems={navItems} />
                {layout.secondaryNav.length > 0 &&
                    <>
                        <Nav.Item className="divider" />
                        <NavItemList navItems={layout.secondaryNav} />
                    </>
                }
                <div className="spacer" />
            </Nav>
        </div>
    );
};
