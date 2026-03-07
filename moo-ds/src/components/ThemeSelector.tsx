import { useTheme } from "../providers"
import { Themes } from "../models";
import { ThemeSample } from "./ThemeSample";

export const ThemeSelector = () => {

    const { theme: currentTheme, setTheme } = useTheme();

    return (
        <div className="theme-selector">
            {Themes.map((t) =>
                <ThemeSample key={t.name} theme={t} selected={currentTheme?.theme === t.theme} onClick={(t) => setTheme(t)} />
            )}
        </div>
    );
}

ThemeSelector.displayName = "ThemeSelector";
