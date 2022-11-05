import { usePhoto } from "../services/msgraph";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Avatar } from "../components";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export const UserMenu = () => {
    const msal = useMsal();
    const isAuthenticated = useIsAuthenticated();

    if (!isAuthenticated) return null;

    const popover = (
        <Popover id="user-popover" className="user-popover">
            <Popover.Header as="h3"><Avatar />{msal.accounts[0]?.name}</Popover.Header>
            <Popover.Body>
                <ul>
                    <li><span>Theme</span><ThemeSwitcher /></li>
                </ul>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
            <div className="user-menu">
                <Avatar />
            </div>
        </OverlayTrigger>
    );
}