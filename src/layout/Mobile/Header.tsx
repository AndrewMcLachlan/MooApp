import { useApp } from "providers";
import{ Nav, Navbar } from "react-bootstrap";

export type MobileHeaderComponent = React.FC<HeaderProps>;

export const Header: MobileHeaderComponent = (props) => {

    const {name: appName} = useApp();

    return (
            <header className="d-lg-none">
                <img src="/logo.svg" alt={`${appName} home`} height="40" className="logo" />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                <Nav>
                    {props.Menu}
                </Nav>
                </Navbar.Collapse>
            </header>
    );
}

export interface HeaderProps {
    Menu: React.ReactNode[];
}