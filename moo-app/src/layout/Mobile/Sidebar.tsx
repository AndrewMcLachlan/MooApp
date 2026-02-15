
import { SidebarComponent } from "../Types";
import { useLayout } from "../../providers";
import { Nav, NavItemList, Drawer } from "@andrewmclachlan/moo-ds";

export const Sidebar: SidebarComponent = ({ navItems = [] }) => {

    const layout = useLayout();

    return (
        <Drawer show={layout.showSidebar} onHide={() => layout.setShowSidebar(false)}>
            <Drawer.Header closeButton />
            <Drawer.Body className="d-lg-none sidebar">
                <Nav column>
                    <NavItemList navItems={navItems} role="menuitem" onClick={() => layout.setShowSidebar(false)} />
                    {layout.secondaryNav.length > 0 &&
                        <>
                            <Nav.Item className="divider" />
                            <NavItemList navItems={layout.secondaryNav} role="menuitem" onClick={() => layout.setShowSidebar(false)} />
                        </>
                    }
                </Nav>
            </Drawer.Body>
        </Drawer>
    );
};
