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

/**
 * What the browser paints its own chrome with when a theme follows the OS.
 *
 * These are the two colours --header-bg resolves light-dark() to, and they have
 * to stay equal to them. iOS fills the status-bar inset with this colour and
 * draws a mismatch against the page's top edge as a gradient ramping down over
 * the header, so a near-miss is worse than no colour at all.
 */
export const systemColours = {
    light: "#FFFFFF",
    dark: "#150D0C",
};

export const Themes: Theme[] = [
    {
        name: "System",
        theme: "",
    },
    {
        name: "Dark warm",
        theme: "dark",
        colour: systemColours.dark
    },
    {
        name: "Dark cool",
        theme: "dark blue",
        colour: "#0C0D11"
    },
    {
        name: "Light",
        theme: "light",
        colour: systemColours.light
    },
    {
        name: "Red",
        theme: "light red",
        colour: "#65000B"
    },
];