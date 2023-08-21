import { ReactNode } from "react";
import { NavItem } from "./NavItem";

export type size = "small" | "default";

export interface LayoutOptions {
    theme?: Theme;
    setTheme?: (theme?: Theme) => void;
    defaultTheme: Theme;
    size: size;
    photo?: string;
    breadcrumbs?: NavItem[];
    setBreadcrumbs?: (items: NavItem[]) => void;
    secondaryNav?: (NavItem|ReactNode)[];
    setSecondaryNav?: (items: (NavItem|ReactNode)[]) => void;
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