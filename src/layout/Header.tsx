import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { UserMenu } from "./UserMenu";
import { useLayout } from "../providers";

export type DesktopHeaderComponent = React.FC<HeaderProps>;

export const Header: DesktopHeaderComponent = (props) => {

    const { size } = useLayout();

    const logoHeight = size == "default" ? 80 : 40;

    return (
        <>
            <header className={`d-none d-lg-block`}>
                <Container fluid>
                    <div>
                        <Link to="/">
                            <img src="/logo.svg" alt={props.AppName} height={logoHeight} className="logo" />
                        </Link>
                        <h1>{props.AppName}</h1>
                    </div>
                    <nav>
                        <ul>
                            {props.Menu.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        <UserMenu />
                    </nav>
                </Container>
            </header>
        </>
    );
};

export interface HeaderProps {
    AppName: string;
    Menu: React.ReactNode[];
};