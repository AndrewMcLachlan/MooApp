export interface ThemeOptions {
    theme?: Theme;
    setTheme?: (theme?: Theme) => void;
    defaultTheme: Theme;
    /** The registered themes (built-ins by default, or a custom list supplied to ThemeProvider). */
    themes: Theme[];
}

/** The theme identifiers shipped with the design system. */
export type BuiltInThemes = "" | "dark" | "light" | "light red" | "dark blue";

/**
 * A theme identifier. Consumers may register additional themes with any string
 * identifier (they are responsible for shipping the matching CSS); the built-in
 * names are kept for editor autocomplete via the `string & {}` intersection.
 */
export type Themes = BuiltInThemes | (string & {});

export interface Theme {
    name: string,
    theme: Themes,
    colour?: string,
};

/** Look up a theme by identifier within a list (defaults to the built-ins). */
export const theme = (theme: Themes, themes: Theme[] = Themes) => themes.find(t => t.theme === theme);

export const Themes: Theme[] = [
    {
        name: "System",
        theme: "",
    },
    {
        name: "Dark warm",
        theme: "dark",
        colour: "#1F1B18"
    },
    {
        name: "Dark cool",
        theme: "dark blue",
        colour: "#181B1F"
    },
    {
        name: "Light",
        theme: "light",
        colour: "#FFF"
    },
    {
        name: "Red",
        theme: "light red",
        colour: "#620000"
    },
];