import { Container } from "react-bootstrap";
import { Link } from "react-router";

import { Breadcrumb, MenuToggle } from "@andrewmclachlan/moo-ds";
import { useApp, useLayout } from "../../providers";
import { HeaderComponent } from "../Types";
import { UserMenu } from "../UserMenu";

export const Header: HeaderComponent = (props) => {

    const { size, breadcrumbs, actions, sidebarCollapsed, setSidebarCollapsed } = useLayout();
    const { name: appName } = useApp();

    const logoHeight = size == "default" ? 80 : 40;

    return (
        <header className="d-none d-lg-block">
            <Container fluid className="first-header">
                <Link to="/" className="logo">
                    <img src="/logo.svg" alt={`${appName} home`} height={logoHeight} />
                </Link>
                <div className="search">
                    {props.search}
                </div>
                <nav>
                    <ul>
                        {props.menu.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                    <UserMenu userMenu={props.userMenu} />
                </nav>
            </Container>
            <Container fluid className="second-header">
                <MenuToggle onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <div className="actions">
                    {actions}
                </div>
            </Container>
        </header>
    );
};
