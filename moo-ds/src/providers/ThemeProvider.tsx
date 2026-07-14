import React, { createContext, useEffect, useMemo } from "react";
import { useContext } from "react";
import { type Theme, type ThemeOptions, theme, Themes as BuiltInThemes } from "../models";
import { useLocalStorage } from "../hooks/localStorage";

const getDefaultTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? theme("dark") : theme("light");

export const ThemeContext = createContext<ThemeOptions>({ defaultTheme: getDefaultTheme(), themes: BuiltInThemes });

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({ children, themes = BuiltInThemes, ...props }) => {

    const defaultTheme = props.defaultTheme ?? getDefaultTheme();

    const [currentTheme, setTheme] = useLocalStorage<Theme>("theme", defaultTheme);

    useEffect(() => {
        const colour = document.getElementsByName("theme-color")[0];
        if (!colour) console.warn("No theme colour meta tag found. Theme colour will not be applied.");

        if (currentTheme.colour) colour?.setAttribute("content", currentTheme.colour);
        document.body.setAttribute("class", currentTheme.theme);
        if (currentTheme.theme === "") {
            document.body.removeAttribute("data-theme");
        } else {
            document.body.setAttribute("data-theme", currentTheme.theme.startsWith("dark") ? "dark" : "light");
        }
    }, [currentTheme]);

    const value = useMemo<ThemeOptions>(() => ({ theme: currentTheme, setTheme, defaultTheme, themes }), [currentTheme, setTheme, defaultTheme, themes]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

export interface ThemeProviderProps {
    defaultTheme?: Theme;
    /** Register a custom set of themes. Defaults to the built-in themes. */
    themes?: Theme[];
}

ThemeProvider.displayName = "ThemeProvider";
