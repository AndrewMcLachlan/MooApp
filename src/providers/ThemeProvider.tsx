import React, { createContext, useEffect } from "react";
import { useContext } from "react";
import * as Models from "../models";
import { useLocalStorage } from "../hooks/localStorage";

const getDefaultTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Models.theme("dark") : Models.theme("light");

export const ThemeContext = createContext<Models.ThemeOptions>({ defaultTheme: getDefaultTheme()});

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({  children }) => {

    const colour = document.getElementsByName("theme-color")[0];

    const defaultTheme = getDefaultTheme();

    const [theme, setTheme] = useLocalStorage<Models.Theme>("theme", defaultTheme);

    useEffect(() => {
        colour.setAttribute("content", theme.colour);
        document.body.setAttribute("class", theme.theme);
        document.body.setAttribute("data-bs-theme", theme.theme === "" ? defaultTheme.theme : theme.theme === "dark" ? "dark" : "light");
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, defaultTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

export interface ThemeProviderProps {
}

ThemeProvider.displayName = "ThemeProvider";
