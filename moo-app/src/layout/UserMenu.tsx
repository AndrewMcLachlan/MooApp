import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Avatar } from "../components";
import { ThemeSelector } from "../components/ThemeSelector";
import { NavItem } from "../models";
import { renderMenu } from "../utils";

export const UserMenu: React.FC<UserMenuProps> = ({userMenu = []}) => {
    const msal = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if (!isAuthenticated) return null;

    const popover = (
        <Popover id="user-popover" className="user-popover">
            <Popover.Header as="h3"><Avatar />{msal.instance.getActiveAccount()?.name}</Popover.Header>
            <Popover.Body>
                <ul>
                    {renderMenu(userMenu, "li")}
                    <li><span>Theme</span><ThemeSelector /></li>
                    <li className="clickable" onClick={() => msal.instance.logoutRedirect()}>Sign out</li>
                </ul>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose containerPadding={10}>
            <div className="user-menu">
                <Avatar />
            </div>
        </OverlayTrigger>
    );
};

export interface UserMenuProps {
    userMenu?: NavItem[] | React.ReactNode[];
};
