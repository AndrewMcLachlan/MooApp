import { type NavItem, NavItemList, OverlayTrigger, Popover, useTheme, Themes } from "@andrewmclachlan/moo-ds";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "../components";
import { useApp } from "../providers";

const isDark = (themeValue: string) => themeValue === "" ?
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false :
    themeValue.startsWith("dark");

export const UserMenu: React.FC<UserMenuProps> = ({userMenu = [], showAppInfo}) => {
    const msal = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const app = useApp();
    const { theme, setTheme } = useTheme();

    if (!isAuthenticated) return null;

    const dark = isDark(theme?.theme ?? "");

    const toggleTheme = () => {
        const target = dark ? Themes.find(t => t.theme === "light") : Themes.find(t => t.theme === "dark");
        if (target) setTheme(target);
    };

    return (
        <OverlayTrigger trigger="click" placement="bottom" rootClose containerPadding={10} overlay={(close) => (
            <Popover id="user-popover" className="user-popover">
                <Popover.Header as="h3"><Avatar />{msal.instance.getActiveAccount()?.name}</Popover.Header>
                <Popover.Body>
                    <ul onClick={close}>
                        <NavItemList navItems={userMenu} as="li" role="menuitem" />
                        <li className="divider" />
                        <li className="clickable theme-toggle" onClick={toggleTheme} role="menuitem">
                            <FontAwesomeIcon icon={dark ? "sun" : "moon"} />
                            {dark ? "Light mode" : "Dark mode"}
                        </li>
                        <li className="divider" />
                        <li className="clickable" onClick={() => msal.instance.logoutRedirect()} role="menuitem"><FontAwesomeIcon icon="arrow-right-from-bracket" />Sign out</li>
                    </ul>
                    {showAppInfo && (
                        <div className="app-info">
                            {app.name} {app.version}
                        </div>
                    )}
                </Popover.Body>
            </Popover>
        )}>
            <div className="user-menu">
                <Avatar />
            </div>
        </OverlayTrigger>
    );
};

export interface UserMenuProps {
    userMenu?: NavItem[] | React.ReactNode[];
    showAppInfo?: boolean;
};
