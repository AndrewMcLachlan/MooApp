import { useIsAuthenticated } from "@azure/msal-react";
import { usePageTitle } from "hooks/pageTitle";
import { Container } from "react-bootstrap";
import { NavItem } from "models";
import { useLayout } from "providers"
import { ReactNode, useEffect } from "react";

export const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, title, breadcrumbs, navItems, actions, ...rest }) => {

    const isAuthenticated = useIsAuthenticated();
    const layout = useLayout();

    usePageTitle(title);

    useEffect(() => {
        layout.setBreadcrumbs(breadcrumbs ?? []);
        layout.setSecondaryNav(navItems ?? []);
        layout.setActions(actions ?? []);
    }, [breadcrumbs, navItems, actions]);

    return (
        <Container fluid as="main" {...rest}>
            {isAuthenticated && children}
        </Container>
    );
}

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    navItems?: (NavItem|ReactNode)[];
    breadcrumbs?: NavItem[];
    actions?: ReactNode[];
}