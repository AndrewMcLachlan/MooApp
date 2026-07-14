import React, { type ReactNode, createContext, useMemo, useState } from "react";
import { useContext } from "react";
import * as Models from "../models";
import { type NavItem } from "@andrewmclachlan/moo-ds";
import { usePhoto } from "../services";
import { useLocalStorage } from "@andrewmclachlan/moo-ds";

const LayoutContext = createContext<Models.LayoutContext>({ size: "default" });

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ size, children }) => {

    const [breadcrumbs, setBreadcrumbs] = useState<NavItem[]>([]);
    const [secondaryNav, setSecondaryNav] = useState<(NavItem | ReactNode)[]>([]);
    const [actions, setActions] = useState<ReactNode[]>([]);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage<boolean>("sidebar-collapse", false);

    const photo = usePhoto();

    const value = useMemo<Models.LayoutContext>(() => ({
        size, photo, breadcrumbs, setBreadcrumbs, secondaryNav, setSecondaryNav, actions, setActions, showSidebar, setShowSidebar, sidebarCollapsed, setSidebarCollapsed,
    }), [size, photo, breadcrumbs, secondaryNav, actions, showSidebar, sidebarCollapsed]);

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Models.LayoutOptions {
}

LayoutProvider.displayName = "LayoutProvider";
