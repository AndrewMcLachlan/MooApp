import React, { createContext, useEffect } from "react";
import { useContext } from "react";
import { Theme, ThemeOptions, theme } from "../models";
import { useLocalStorage } from "../hooks/localStorage";

const getDefaultTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? theme("dark") : theme("light");

export const ThemeContext = createContext<ThemeOptions>({ defaultTheme: getDefaultTheme() });

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({ children, ...props }) => {

    const colour = document.getElementsByName("theme-color")[0];
    if (!colour) console.warn("No theme colour meta tag found. Theme colour will not be applied.");

    const defaultTheme = props.defaultTheme ?? getDefaultTheme();

    const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultTheme);

    useEffect(() => {
        colour?.setAttribute("content", theme.colour);
        document.body.setAttribute("class", theme.theme);
        if (theme.theme === "") {
            document.body.removeAttribute("data-theme");
        } else {
            document.body.setAttribute("data-theme", theme.theme.startsWith("dark") ? "dark" : "light");
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, defaultTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

export interface ThemeProviderProps {
    defaultTheme?: Theme;
}

ThemeProvider.displayName = "ThemeProvider";
