import React, { createContext, useEffect } from "react";
import { useContext } from "react";
import { Theme, ThemeOptions, theme } from "../models";
import { useLocalStorage } from "../hooks/localStorage";

const getDefaultTheme = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? theme("dark") : theme("light");

export const ThemeContext = createContext<ThemeOptions>({ defaultTheme: getDefaultTheme() });

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({ children }) => {

    const colour = document.getElementsByName("theme-color")[0];

    const defaultTheme = getDefaultTheme();

    const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultTheme);

    useEffect(() => {
        colour.setAttribute("content", theme.colour);
        document.body.setAttribute("class", theme.theme);
        document.body.setAttribute("data-bs-theme", theme.theme === "" ? defaultTheme.theme : theme.theme.startsWith("dark") ? "dark" : "light");
    }, [theme]);

    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (theme.name !== "Default") return;
            document.body.setAttribute("data-bs-theme", event.matches ? "dark" : "light");
        });

        return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => { });
    }, []);

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
