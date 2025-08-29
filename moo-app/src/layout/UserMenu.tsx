import { NavItem, NavItemList } from "@andrewmclachlan/moo-ds";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Avatar } from "../components";

export const UserMenu: React.FC<UserMenuProps> = ({userMenu = []}) => {
    const msal = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if (!isAuthenticated) return null;

    const popover = (
        <Popover id="user-popover" className="user-popover">
            <Popover.Header as="h3"><Avatar />{msal.instance.getActiveAccount()?.name}</Popover.Header>
            <Popover.Body>
                <ul>
                    <NavItemList navItems={userMenu} as="li" role="menuitem" />
                    <li className="divider" />
                    <li className="clickable" onClick={() => msal.instance.logoutRedirect()} role="menuitem"><FontAwesomeIcon icon="arrow-right-from-bracket" />Sign out</li>
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
