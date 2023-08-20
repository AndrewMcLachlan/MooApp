import { useIsAuthenticated } from "@azure/msal-react";
import { usePageTitle } from "hooks/pageTitle";
import { Container } from "react-bootstrap";
import { NavItem } from "models";
import { useLayout } from "providers"
import { useEffect } from "react";

export const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, title, breadcrumbs, navItems, ...rest }) => {

    const isAuthenticated = useIsAuthenticated();
    const layout = useLayout();

    usePageTitle(title);

    useEffect(() => {
        layout.setBreadcrumbs(breadcrumbs ?? []);
        layout.setSecondaryNav(navItems ?? []);
    }, []);

    return (
        <Container fluid as="main" {...rest}>
            {isAuthenticated && children}
        </Container>
    );
}

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    navItems?: NavItem[];
    breadcrumbs?: NavItem[];
}