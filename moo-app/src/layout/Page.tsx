import { useIsAuthenticated } from "@azure/msal-react";
import { usePageTitle } from "../hooks/pageTitle";
import { Container, type NavItem } from "@andrewmclachlan/moo-ds";
import { useLayout } from "../providers"
import { type ReactNode, useEffect, useRef } from "react";

// Stable empty-array reference so the no-props case never changes identity.
const EMPTY: never[] = [];

// Calls `setter` only when the serialized content of `value` differs from the
// last-applied value stored in `ref`. If the value can't be serialized (it may
// contain non-serializable ReactNodes), fall back to calling the setter every
// time for that field, preserving the original behaviour rather than risking
// staleness.
const applyIfChanged = <T,>(ref: React.MutableRefObject<string | undefined>, value: T, setter: (value: T) => void) => {
    let key: string | undefined;
    try {
        key = JSON.stringify(value);
    } catch {
        key = undefined;
    }

    if (key === undefined || key !== ref.current) {
        ref.current = key;
        setter(value);
    }
};

export const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, title, breadcrumbs, navItems, actions, ...rest }) => {

    const isAuthenticated = useIsAuthenticated();
    const layout = useLayout();

    usePageTitle(title);

    const lastBreadcrumbs = useRef<string | undefined>(undefined);
    const lastNavItems = useRef<string | undefined>(undefined);
    const lastActions = useRef<string | undefined>(undefined);

    useEffect(() => {
        const resolvedBreadcrumbs = breadcrumbs ?? EMPTY;
        const resolvedNavItems = navItems ?? EMPTY;
        const resolvedActions = actions ?? EMPTY;

        applyIfChanged(lastBreadcrumbs, resolvedBreadcrumbs, layout.setBreadcrumbs);
        applyIfChanged(lastNavItems, resolvedNavItems, layout.setSecondaryNav);
        applyIfChanged(lastActions, resolvedActions, layout.setActions);
    }, [breadcrumbs, navItems, actions]);

    return (
        <Container fluid as="main" {...rest}>
            {isAuthenticated && children}
        </Container>
    );
}

Page.displayName = "Page";

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    navItems?: (NavItem|ReactNode)[];
    breadcrumbs?: NavItem[];
    actions?: ReactNode[];
}
