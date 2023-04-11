import { useMsal } from "@azure/msal-react";
import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import * as Models from "../models";
import { usePhoto } from "../services";
import { useLocalStorage } from "../hooks/localStorage";

export const LayoutContext = createContext<Models.LayoutOptions>({ size: "default", defaultTheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light" });

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ size, children }) => {

    const colour = document.getElementsByName("theme-color")[0];

    const defaultTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

    const [theme, setTheme] = useLocalStorage<Models.Theme>("theme", defaultTheme);

    useEffect(() => {
        colour.setAttribute("content", theme === "dark" ? "#620000" : "#C20000");
        document.body.setAttribute("class", theme);
    }, [theme]);

    const msal = useMsal();
    const photo = usePhoto(msal.instance?.getActiveAccount()?.username);

    return (
        <LayoutContext.Provider value={{ setTheme, size, defaultTheme: defaultTheme, photo: photo}}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Omit<Models.LayoutOptions, "theme" | "setTheme" | "defaultTheme"> {
}

LayoutProvider.displayName = "LayoutProvider";
