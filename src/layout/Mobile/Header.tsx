import { Breadcrumb } from "components";
import { HeaderComponent } from "layout/Types";
import { UserMenu } from "layout/UserMenu";
import { useApp, useLayout } from "providers";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Header: HeaderComponent = (props) => {
const { size, breadcrumbs, actions, setShowSidebar } = useLayout();
const { name: appName } = useApp();

const logoHeight = size == "default" ? 80 : 40;

return (
    <header className=" d-lg-none">
        <Container fluid className="first-header">
            <div>
                <Link to="/">
                    <img src="/logo.svg" alt={`${appName} home`} height={logoHeight} className="logo" />
                </Link>
            </div>
            <div className="search">
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
            {/*<button className="sidebar-toggle" onClick={() => document.body.classList.toggle("sidebar-open")}><img src="/logo.svg" alt={`${appName} home`} height={logoHeight} className="logo" /></button>*/}
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setShowSidebar(true)} />
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <div className="actions">
                {actions}
            </div>
        </Container>
    </header>
);
                    }
/*
export const Header: HeaderComponent = (props) => {

    const { name: appName } = useApp();

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
*/