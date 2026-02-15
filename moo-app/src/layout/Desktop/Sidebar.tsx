import classNames from "classnames";
import { useLayout } from "../../providers";
import { Nav } from "@andrewmclachlan/moo-ds";
import { SidebarComponent } from "../Types";
import { NavItemList } from "@andrewmclachlan/moo-ds";

export const Sidebar: SidebarComponent = ({ navItems = [] }) => {

    const layout = useLayout();

    return (
        <div id="sidebar" className={classNames("sidebar", layout.sidebarCollapsed ? "collapsed" : "", "d-none d-lg-flex")}>
            <Nav column>
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
