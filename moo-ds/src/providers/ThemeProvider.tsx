import React, { createContext, useEffect, useMemo } from "react";
import { useContext } from "react";
import { type Theme, type ThemeOptions, theme, Themes as BuiltInThemes, systemColours } from "../models";
import { useLocalStorage } from "../hooks/localStorage";

// SSR-safe: window/matchMedia are only touched when available. Resolves the
// preferred default within the supplied theme list, falling back to the first
// entry (then a built-in) so a custom list without "dark"/"light" ids still
// yields a valid theme.
const getDefaultTheme = (list: Theme[] = BuiltInThemes): Theme => {
    const prefersDark = typeof window !== "undefined" && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return (prefersDark ? theme("dark", list) : theme("light", list)) ?? list[0] ?? theme("light")!;
};

export const ThemeContext = createContext<ThemeOptions>({ defaultTheme: getDefaultTheme(), themes: BuiltInThemes });

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({ children, themes = BuiltInThemes, ...props }) => {

    const defaultTheme = props.defaultTheme ?? getDefaultTheme(themes);

    const [currentTheme, setTheme] = useLocalStorage<Theme>("theme", defaultTheme);

    useEffect(() => {
        const colour = document.getElementsByName("theme-color")[0];
        if (!colour) console.warn("No theme colour meta tag found. Theme colour will not be applied.");

        document.body.setAttribute("class", currentTheme.theme);
        if (currentTheme.theme === "") {
            document.body.removeAttribute("data-theme");
        } else {
            document.body.setAttribute("data-theme", currentTheme.theme.startsWith("dark") ? "dark" : "light");
        }

        const query = window.matchMedia?.("(prefers-color-scheme: dark)");

        // Must always name a colour, never clear it. With none set the browser
        // samples the page instead, and iOS fills the status-bar inset with what
        // it makes of that -- a gradient ramping down over the header rather
        // than a flat colour meeting it.
        const apply = () => colour?.setAttribute("content",
            currentTheme.colour ?? (query?.matches ? systemColours.dark : systemColours.light));

        apply();

        // "System" follows the OS, so it has to be repainted when the OS changes.
        if (currentTheme.colour) return undefined;
        query?.addEventListener("change", apply);
        return () => query?.removeEventListener("change", apply);
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
