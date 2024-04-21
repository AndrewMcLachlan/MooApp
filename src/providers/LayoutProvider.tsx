import { useMsal } from "@azure/msal-react";
import React, { ReactNode, createContext,  useState } from "react";
import { useContext } from "react";
import * as Models from "../models";
import { usePhoto } from "../services";
import { useLocalStorage } from "hooks";

const LayoutContext = createContext<Models.LayoutContext>({ size: "default" });

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ size, children }) => {

    const [breadcrumbs, setBreadcrumbs] = useState<Models.NavItem[]>([]);
    const [secondaryNav, setSecondaryNav] = useState<(Models.NavItem|ReactNode)[]>([]);
    const [actions, setActions] = useState<ReactNode[]>([]);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage<boolean>("sidebar-collapse", false);

    const msal = useMsal();
    const photo = usePhoto(msal.instance?.getActiveAccount()?.username);

    return (
        <LayoutContext.Provider value={{ size, photo, breadcrumbs, setBreadcrumbs, secondaryNav, setSecondaryNav, actions, setActions, showSidebar, setShowSidebar, sidebarCollapsed, setSidebarCollapsed}}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Models.LayoutOptions {
}

LayoutProvider.displayName = "LayoutProvider";
