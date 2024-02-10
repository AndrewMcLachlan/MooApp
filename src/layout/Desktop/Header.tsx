import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Breadcrumb } from "components";
import { HeaderComponent } from "layout/Types";
import { useApp, useLayout } from "providers";
import { UserMenu } from "../UserMenu";

export const Header: HeaderComponent = (props) => {

    const { size, breadcrumbs, actions } = useLayout();
    const { name: appName } = useApp();

    const logoHeight = size == "default" ? 80 : 40;

    return (
        <header className="d-none d-lg-block">
            <Container fluid className="first-header">
                <div>
                    <Link to="/">
                        <img src="/logo.svg" alt={`${appName} home`} height={logoHeight} className="logo" />
                    </Link>
                </div>
                <div className="search">
                    {props.Search}
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
