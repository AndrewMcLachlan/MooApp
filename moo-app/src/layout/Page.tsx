import { useIsAuthenticated } from "@azure/msal-react";
import { usePageTitle } from "../hooks/pageTitle";
import { Stack, type NavItem, type PageAction } from "@andrewmclachlan/moo-ds";
import { useLayout } from "../providers"
import { type ReactNode, useEffect, useRef } from "react";

// Stable empty-array reference so the no-props case never changes identity.
const EMPTY: never[] = [];

// breadcrumbs are plain, serializable NavItem data, so a content hash safely
// suppresses redundant updates even when callers pass a fresh array literal.
const applyByContent = <T,>(ref: React.MutableRefObject<string | undefined>, value: T, setter: (value: T) => void) => {
    const key = JSON.stringify(value);
    if (key !== ref.current) {
        ref.current = key;
        setter(value);
    }
};

// navItems/actions may contain ReactNodes, which JSON.stringify serializes
// lossily (functions/components drop out) — a content hash could wrongly treat
// two different elements as equal. Guard by reference instead: stable/undefined
// references are suppressed; inline literals fall through to the setter as
// before, with no risk of a stale skip.
const applyByReference = <T,>(ref: React.MutableRefObject<unknown>, value: T, setter: (value: T) => void) => {
    if (ref.current !== value) {
        ref.current = value;
        setter(value);
    }
};

export const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, title, breadcrumbs, navItems, actions, customActions, ...rest }) => {

    const isAuthenticated = useIsAuthenticated();
    const layout = useLayout();

    usePageTitle(title);

    const lastBreadcrumbs = useRef<string | undefined>(undefined);
    const lastNavItems = useRef<unknown>(undefined);
    const lastActions = useRef<unknown>(undefined);
    const lastCustomActions = useRef<unknown>(undefined);

    useEffect(() => {
        const resolvedBreadcrumbs = breadcrumbs ?? EMPTY;
        const resolvedNavItems = navItems ?? EMPTY;
        const resolvedActions = actions ?? EMPTY;
        const resolvedCustomActions = customActions ?? EMPTY;

        applyByContent(lastBreadcrumbs, resolvedBreadcrumbs, layout.setBreadcrumbs);
        applyByReference(lastNavItems, resolvedNavItems, layout.setSecondaryNav);
        applyByReference(lastActions, resolvedActions, layout.setActions);
        applyByReference(lastCustomActions, resolvedCustomActions, layout.setCustomActions);
    }, [breadcrumbs, navItems, actions, customActions]);

    return (
        <Stack as="main" {...rest}>
            {isAuthenticated && children}
        </Stack>
    );
}

Page.displayName = "Page";

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    navItems?: (NavItem|ReactNode)[];
    breadcrumbs?: NavItem[];
    actions?: PageAction[];
    /** Escape hatch for controls that are neither a command nor a link. */
    customActions?: ReactNode[];
}
