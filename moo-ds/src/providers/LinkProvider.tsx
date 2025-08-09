import { createContext, useContext, ReactNode } from "react";
import { LinkComponent, NavLinkComponent } from "../models";

const LinkContext = createContext<{ Link: LinkComponent, NavLink: NavLinkComponent }>(null);

export const LinkProvider: React.FC<{ LinkComponent: LinkComponent, NavLinkComponent: NavLinkComponent, children: ReactNode }> = ({ 
    LinkComponent,
    NavLinkComponent,
    children 
}) => (
    <LinkContext.Provider value={{Link: LinkComponent, NavLink: NavLinkComponent}}>
        {children}
    </LinkContext.Provider>
);

export const useLink = () => {
    const { Link } = useContext(LinkContext);
    if (!Link) {
        throw new Error("useLink must be used within a LinkProvider");
    }
    return Link;
};

export const useNavLink = () => {
    const { NavLink } = useContext(LinkContext);
    if (!NavLink) {
        throw new Error("useNavLink must be used within a LinkProvider");
    }
    return NavLink;
};