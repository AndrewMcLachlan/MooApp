import { useMsal } from "@azure/msal-react";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { useContext } from "react";
import * as Models from "../models";
import { usePhoto } from "../services";
import { useLocalStorage } from "../hooks/localStorage";

const getDefaultTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Models.theme("dark") : Models.theme("light");

export const LayoutContext = createContext<Models.LayoutOptions>({ size: "default", defaultTheme: getDefaultTheme()});

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ size, children }) => {

    const colour = document.getElementsByName("theme-color")[0];

    const defaultTheme = getDefaultTheme();

    const [theme, setTheme] = useLocalStorage<Models.Theme>("theme", defaultTheme);
    const [breadcrumbs, setBreadcrumbs] = useState<Models.NavItem[]>([]);
    const [secondaryNav, setSecondaryNav] = useState<(Models.NavItem|ReactNode)[]>([]);
    const [actions, setActions] = useState<ReactNode[]>([]);

    useEffect(() => {
        colour.setAttribute("content", theme.colour);
        document.body.setAttribute("class", theme.theme);
        document.body.setAttribute("data-bs-theme", theme.theme === "" ? defaultTheme.theme : theme.theme === "dark" ? "dark" : "light");
    }, [theme]);

    const msal = useMsal();
    const photo = usePhoto(msal.instance?.getActiveAccount()?.username);

    return (
        <LayoutContext.Provider value={{ theme, setTheme, size, defaultTheme: defaultTheme, photo: photo, breadcrumbs, setBreadcrumbs, secondaryNav, setSecondaryNav, actions, setActions}}>
            {children}
        </LayoutContext.Provider>
    );
}



export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Omit<Models.LayoutOptions, "theme" | "setTheme" | "defaultTheme" | "breadcrumbs" | "setBreadcrumbs" | "secondaryNav" | "setSecondaryNav" | "actions" | "setActions"> {
}

LayoutProvider.displayName = "LayoutProvider";
