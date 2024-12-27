import { useTheme } from "../providers"
import { Themes } from "../models";
import { ComboBox } from "./ComboBox";

export const ThemeSelector = () => {

    const { theme, setTheme } = useTheme();

    return (
        <ComboBox selectedItems={[theme]} onChange={(t) => setTheme(t[0])} items={Themes} labelField={t => t.name} valueField={t => t.theme?.toString()} />
    );
}

ThemeSelector.displayName = "ThemeSelector";
