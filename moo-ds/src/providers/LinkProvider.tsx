import { createContext, useContext, useMemo, type ReactNode } from "react";
import { type LinkComponent, type NavLinkComponent } from "../models";

const LinkContext = createContext<{ Link: LinkComponent, NavLink: NavLinkComponent } | null>(null);

export const LinkProvider: React.FC<{ LinkComponent: LinkComponent, NavLinkComponent: NavLinkComponent, children: ReactNode }> = ({
    LinkComponent,
    NavLinkComponent,
    children
}) => {
    const value = useMemo(() => ({ Link: LinkComponent, NavLink: NavLinkComponent }), [LinkComponent, NavLinkComponent]);

    return (
        <LinkContext.Provider value={value}>
            {children}
        </LinkContext.Provider>
    );
};

export const useLink = () => {
    const context = useContext(LinkContext);
    if (!context?.Link) {
        throw new Error("useLink must be used within a LinkProvider");
    }
    return context.Link;
};

export const useNavLink = () => {
    const context = useContext(LinkContext);
    if (!context?.NavLink) {
        throw new Error("useNavLink must be used within a LinkProvider");
    }
    return context.NavLink;
};