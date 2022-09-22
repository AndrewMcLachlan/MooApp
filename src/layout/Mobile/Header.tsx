import{ Nav, Navbar } from "react-bootstrap";

export type MobileHeaderComponent = React.FC<HeaderProps>;

export const Header: MobileHeaderComponent = (props) => {

    return (
            <header className="d-lg-none">
                <img src="/logo.svg" alt={props.AppName} height="40" className="logo" />
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
    AppName: string;
    Menu: React.ReactNode[];
}