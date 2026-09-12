import { type NavItem, Drawer, Menu, Nav, NavItemList, Themes, useTheme } from "@andrewmclachlan/moo-ds";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isValidElement } from "react";
import { Avatar } from "../../components";
import { useLayout } from "../../providers";
import { type SidebarComponent } from "../Types";

const isDark = (themeValue: string) => themeValue === "" ?
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false :
    themeValue.startsWith("dark");

const isNavItem = (item: NavItem | React.ReactNode): item is NavItem =>
    !isValidElement(item) && typeof item === "object" && item !== null && "text" in item;

/** Matches NavItemList: a string is a source, anything else is already a node. */
const itemImage = (image: NavItem["image"]) =>
    typeof image === "string" ? <img src={image} alt="" /> : image;

export const Sidebar: SidebarComponent = ({ navItems = [], userMenu = [], menu = [] }) => {

    const layout = useLayout();
    const msal = useMsal();
    const { theme, setTheme } = useTheme();

    const dark = isDark(theme?.theme ?? "");
    const name = msal.instance.getActiveAccount()?.name;

    const close = () => layout.setShowSidebar(false);

    const toggleTheme = () => {
        const target = dark ? Themes.find(t => t.theme === "light") : Themes.find(t => t.theme === "dark");
        if (target) setTheme(target);
    };

    return (
        <Drawer id="mobile-sidebar" show={layout.showSidebar} onHide={close} className="sidebar-drawer">
            <Drawer.Header closeButton className="sidebar-identity">
                <Menu
                    id="drawer-user-menu"
                    placement="bottom"
                    className="drawer-user-menu"
                    header={name && <span className="menu-header-name">{name}</span>}
                    trigger={(
                        <button type="button" className="sidebar-identity-trigger" aria-label={name ? `Account: ${name}` : "Account"}>
                            <Avatar />
                            <FontAwesomeIcon icon="chevron-down" />
                        </button>
                    )}
                >
                    {(userMenu as (NavItem | React.ReactNode)[]).map((item, index) => isNavItem(item) ? (
                        <Menu.Item
                            key={item.id ?? item.route ?? item.text}
                            icon={itemImage(item.image)}
                            to={item.route}
                            onClick={e => { item.onClick?.(e); close(); }}
                        >
                            {item.text}
                        </Menu.Item>
                    ) : (
                        <li className="menu-item" key={`node${index}`} onClick={close}>{item as React.ReactNode}</li>
                    ))}
                    <Menu.Divider />
                    <Menu.Item icon={<FontAwesomeIcon icon={dark ? "sun" : "moon"} />} onClick={toggleTheme}>
                        {dark ? "Light mode" : "Dark mode"}
                    </Menu.Item>
                    <Menu.Item icon={<FontAwesomeIcon icon="arrow-right-from-bracket" />} onClick={() => msal.instance.logoutRedirect()}>
                        Sign out
                    </Menu.Item>
                </Menu>
                {menu.length > 0 && (
                    <div className="sidebar-identity-actions" onClick={close}>{menu}</div>
                )}
            </Drawer.Header>
            <Drawer.Body className="d-lg-none sidebar">
                <Nav column>
                    <NavItemList navItems={navItems} role="menuitem" onClick={close} />
                    {layout.secondaryNav.length > 0 &&
                        <>
                            <Nav.Item className="divider" />
                            <NavItemList navItems={layout.secondaryNav} role="menuitem" onClick={close} />
                        </>
                    }
                </Nav>
            </Drawer.Body>
        </Drawer>
    );
};
