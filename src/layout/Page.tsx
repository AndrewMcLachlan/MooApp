import { usePageTitle } from "hooks/pageTitle";
import { NavItem } from "models";
import { useLayout } from "providers"
import { useEffect } from "react";

export const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, ...props }) => {

    const layout = useLayout();

    usePageTitle(props.title);

    useEffect(() => {
        layout.setBreadcrumbs(props.breadcrumbs ?? []);
        layout.setSecondaryNav(props.navItems ?? []);
    }, []);

    return (
        <>
            {children}
        </>
    );
}

export interface PageProps {
    title: string;
    navItems?: NavItem[];
    breadcrumbs?: NavItem[];
}