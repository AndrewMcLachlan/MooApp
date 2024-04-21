import { Breadcrumb } from "../../components";
import { MenuToggle } from "../../layout/MenuToggle";
import { HeaderComponent } from "../../layout/Types";
import { UserMenu } from "../../layout/UserMenu";
import { useApp, useLayout } from "../../providers";
import { Container } from "react-bootstrap";
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
                        {props.menu.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                    <UserMenu />
                </nav>
            </Container>
            <Container fluid className="second-header">
                <MenuToggle onClick={() => setShowSidebar(true)} />
                <Breadcrumb breadcrumbs={breadcrumbs} />
                <div className="actions">
                    {actions}
                </div>
            </Container>
        </header>
    );
};
