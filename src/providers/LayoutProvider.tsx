import React, { createContext, useEffect } from "react";
import { useContext } from "react";
import * as Models from "../models";

export const LayoutContext = createContext<Models.LayoutOptions>({ defaultTheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light" });

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ theme, setTheme, children }) => {

    const colour = document.getElementsByName("theme-color")[0];

    useEffect(() => {
        colour.setAttribute("content", theme === "dark" ? "#620000" : "#C20000");
    }, [theme]);

    const defaultTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

    useEffect(() => {
        colour.setAttribute("content", defaultTheme === "dark" ? "#620000" : "#C20000");
    }, []);

    return (
        <LayoutContext.Provider value={{ theme, setTheme, defaultTheme: defaultTheme}}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Omit<Models.LayoutOptions, "defaultTheme"> {
}

LayoutProvider.displayName = "LayoutProvider";