import { useMsal } from "@azure/msal-react";
import React, { ReactNode, createContext,  useState } from "react";
import { useContext } from "react";
import * as Models from "../models";
import { usePhoto } from "../services";

export const LayoutContext = createContext<Models.LayoutOptions>({ size: "default" });

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ size, children }) => {

    const [breadcrumbs, setBreadcrumbs] = useState<Models.NavItem[]>([]);
    const [secondaryNav, setSecondaryNav] = useState<(Models.NavItem|ReactNode)[]>([]);
    const [actions, setActions] = useState<ReactNode[]>([]);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const msal = useMsal();
    const photo = usePhoto(msal.instance?.getActiveAccount()?.username);

    return (
        <LayoutContext.Provider value={{ size, photo, breadcrumbs, setBreadcrumbs, secondaryNav, setSecondaryNav, actions, setActions, showSidebar, setShowSidebar}}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Omit<Models.LayoutOptions, "theme" | "setTheme" | "defaultTheme" | "breadcrumbs" | "setBreadcrumbs" | "secondaryNav" | "setSecondaryNav" | "actions" | "setActions" | "showSidebar" | "setShowSidebar"> {
}

LayoutProvider.displayName = "LayoutProvider";
