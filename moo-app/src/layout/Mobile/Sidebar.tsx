import { type SidebarComponent } from "../Types";
import { useLayout } from "../../providers";
import { Nav, NavItemList, Drawer, useTheme, Themes } from "@andrewmclachlan/moo-ds";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isDark = (themeValue: string) => themeValue === "" ?
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false :
    themeValue.startsWith("dark");

/**
 * The mobile shell has one header band and no room for an identity menu, so
 * everything the desktop header keeps in its top-right corner lives here
 * instead: the page's own menu nodes, the user's items, the theme toggle and
 * sign out.
 */
export const Sidebar: SidebarComponent = ({ navItems = [], userMenu = [], menu = [] }) => {

    const layout = useLayout();
    const msal = useMsal();
    const { theme, setTheme } = useTheme();

    const dark = isDark(theme?.theme ?? "");

    const close = () => layout.setShowSidebar(false);

    const toggleTheme = () => {
        const target = dark ? Themes.find(t => t.theme === "light") : Themes.find(t => t.theme === "dark");
        if (target) setTheme(target);
    };

    return (
        <Drawer show={layout.showSidebar} onHide={close} className="sidebar-drawer">
            <Drawer.Header closeButton />
            <Drawer.Body className="d-lg-none sidebar">
                <Nav column>
                    <NavItemList navItems={navItems} role="menuitem" onClick={close} />
                    {layout.secondaryNav.length > 0 &&
                        <>
                            <Nav.Item className="divider" />
                            <NavItemList navItems={layout.secondaryNav} role="menuitem" onClick={close} />
                        </>
                    }
                    <Nav.Item className="divider" />
                    {userMenu.length > 0 && <NavItemList navItems={userMenu} role="menuitem" onClick={close} />}
                    {menu.map((item: React.ReactNode, i: number) => (
                        <Nav.Item key={i} className="sidebar-menu-node" onClick={close}>{item}</Nav.Item>
                    ))}
                    <Nav.Item className="clickable" role="menuitem" onClick={toggleTheme}>
                        <FontAwesomeIcon icon={dark ? "sun" : "moon"} />
                        {dark ? "Light mode" : "Dark mode"}
                    </Nav.Item>
                    <Nav.Item className="clickable" role="menuitem" onClick={() => msal.instance.logoutRedirect()}>
                        <FontAwesomeIcon icon="arrow-right-from-bracket" />
                        Sign out
                    </Nav.Item>
                </Nav>
            </Drawer.Body>
        </Drawer>
    );
};
