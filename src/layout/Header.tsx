import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import { ThemeSwitcher } from "../components/ThemeSwitcher";

export type DesktopHeaderComponent = React.FC<HeaderProps>;

export const Header: DesktopHeaderComponent = (props) => {

    return (
        <>
            <header className="d-none d-lg-block">
                <Container>
                    <Link to="/">
                        <img src="/logo.svg" alt={props.AppName} height="80" className="logo" />
                    </Link>
                    <h1>{props.AppName}</h1>
                </Container>
                <nav>
                    <ul>
                        <li><ThemeSwitcher /></li>
                        {props.Menu.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </nav>
            </header>
        </>
    );
}

export interface HeaderProps {
    AppName: string;
    Menu: React.ReactNode[];
}