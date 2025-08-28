
import { SidebarComponent } from "../Types";
import { useLayout } from "../../providers";
import { Nav, Offcanvas } from "react-bootstrap";
import { NavItemList } from "@andrewmclachlan/moo-ds";

export const Sidebar: SidebarComponent = ({ navItems = [] }) => {

    const layout = useLayout();

    return (
        <Offcanvas show={layout.showSidebar}>
            <Offcanvas.Header closeButton onHide={() => layout.setShowSidebar(false)} />
            <Offcanvas.Body className="mobile sidebar">
                <Nav className="flex-column ">
                    <NavItemList navItems={navItems} role="menuitem" onClick={() => layout.setShowSidebar(false)} />
                    {layout.secondaryNav.length > 0 &&
                        <>
                            <Nav.Item className="divider" />
                            <NavItemList navItems={layout.secondaryNav} role="menuitem" onClick={() => layout.setShowSidebar(false)} />
                        </>
                    }
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};
