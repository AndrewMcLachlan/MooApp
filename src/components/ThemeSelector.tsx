import { useTheme } from "../providers"
import Select from "react-select";
import { Themes } from "models";

export const ThemeSelector = () => {

    const { theme, setTheme } = useTheme();

    return (
        <Select value={theme} onChange={(t) => setTheme(t)} options={Themes} getOptionLabel={t => t.name} getOptionValue={t => t.theme?.toString()} className="react-select" classNamePrefix="react-select" />

    );
}