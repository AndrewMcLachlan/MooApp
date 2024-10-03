export interface ThemeOptions {
    theme?: Theme;
    setTheme?: (theme?: Theme) => void;
    defaultTheme: Theme;
}

export type Themes = "" | "dark" | "light" | "red";

export interface Theme {
    name: string,
    theme: Themes,
    colour?: string,
};

export const theme = (theme: Themes) =>  Themes.find(t => t.theme === theme);

export const Themes: Theme[] = [
    {
        name: "Default",
        theme: "",
    },
    {
        name: "Dark",
        theme: "dark",
        colour: "#1F1B18"
    },
    {
        name: "Light",
        theme: "light",
        colour: "#FFF"
    },
    {
        name: "Red",
        theme: "red",
        colour: "#620000"
    },
];