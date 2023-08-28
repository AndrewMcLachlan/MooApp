import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { UserMenu } from "./UserMenu";
import { useLayout } from "../providers";
import { Breadcrumb } from "../components";

export type DesktopHeaderComponent = React.FC<HeaderProps>;

export const Header: DesktopHeaderComponent = (props) => {

    const { size, breadcrumbs, actions } = useLayout();

    const logoHeight = size == "default" ? 80 : 40;

    return (
        <header className={`d-none d-lg-block`}>
            <Container fluid>
                <div>
                    <Link to="/">
                        <img src="/logo.svg" alt={props.AppName} height={logoHeight} className="logo" />
                    </Link>
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
            <Container fluid className="second-header">
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <div className="actions">
                    {actions}
                </div>
            </Container>
        </header>
    );
};

export interface HeaderProps {
    AppName: string;
    Menu: React.ReactNode[];
};