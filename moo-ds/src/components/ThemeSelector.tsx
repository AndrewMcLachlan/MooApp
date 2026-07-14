import { useTheme } from "../providers"
import { ThemeSample } from "./ThemeSample";

export const ThemeSelector = () => {

    const { theme: currentTheme, setTheme, themes } = useTheme();

    return (
        <div className="theme-selector">
            {themes.map((t) =>
                <ThemeSample key={t.name} theme={t} selected={currentTheme?.theme === t.theme} onClick={(t) => setTheme(t)} />
            )}
        </div>
    );
}

ThemeSelector.displayName = "ThemeSelector";
