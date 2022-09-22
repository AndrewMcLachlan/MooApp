import React, { createContext } from "react";
import { useContext } from "react";
import * as Models from "../models";

export const LayoutContext = createContext<Models.LayoutOptions>({ defaultTheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light" });

export const LayoutProvider: React.FC<React.PropsWithChildren<LayoutProviderProps>> = ({ theme, setTheme, children }) => {


    return (
        <LayoutContext.Provider value={{ theme, setTheme, defaultTheme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light" }}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);

export interface LayoutProviderProps extends Omit<Models.LayoutOptions, "defaultTheme"> {
}

LayoutProvider.displayName = "LayoutPRovider";