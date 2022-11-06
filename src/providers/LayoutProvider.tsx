import { useMsal } from "@azure/msal-react";
import React, { createContext, useEffect } from "react";
import { useContext } from "react";
import * as Models from "../models";
import { usePhoto } from "../services";

export const LayoutContext = createContext<Models.LayoutOptions>({ size: "default", defaultTheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light" });

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ theme, setTheme, size, children }) => {

    const colour = document.getElementsByName("theme-color")[0];

    useEffect(() => {
        colour.setAttribute("content", theme === "dark" ? "#620000" : "#C20000");
        document.body.setAttribute("class", theme);
    }, [theme]);

    const defaultTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

    useEffect(() => {
        colour.setAttribute("content", defaultTheme === "dark" ? "#620000" : "#C20000");
        document.body.setAttribute("class", defaultTheme);
    }, []);

    const msal = useMsal();
    const photo = usePhoto(msal.instance?.getActiveAccount()?.username);

    return (
        <LayoutContext.Provider value={{ theme, setTheme, size, defaultTheme: defaultTheme, photo: photo}}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Omit<Models.LayoutOptions, "defaultTheme"> {
}

LayoutProvider.displayName = "LayoutProvider";
