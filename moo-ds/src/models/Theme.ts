export interface ThemeOptions {
    theme?: Theme;
    setTheme?: (theme?: Theme) => void;
    defaultTheme: Theme;
}

export type Themes = "" | "dark" | "light" | "light red" | "dark blue";

export interface Theme {
    name: string,
    theme: Themes,
    colour?: string,
};

export const theme = (theme: Themes) =>  Themes.find(t => t.theme === theme);

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