export interface LayoutOptions {
    theme?: Theme;
    setTheme?: (theme?: Theme) => void;
    defaultTheme: Theme;
}

export type Theme = "dark" | "light";