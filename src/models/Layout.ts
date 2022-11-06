export type size = "small" | "default";

export interface LayoutOptions {
    theme?: Theme;
    setTheme?: (theme?: Theme) => void;
    defaultTheme: Theme;
    size: size;
    photo?: string;
}

export type Theme = "dark" | "light";