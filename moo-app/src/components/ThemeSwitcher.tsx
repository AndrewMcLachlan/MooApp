import Form from "react-bootstrap/Form";
import { useTheme } from "../providers"
import { theme as getTheme } from "../models";

export const ThemeSwitcher = () => {

    const { theme, setTheme } = useTheme();

    return (
        <Form.Check className="theme-switcher" type="switch" checked={theme.theme === "light"} onChange={e => setTheme(e.currentTarget.checked ? getTheme("light") : getTheme("dark"))} />
    );
}

ThemeSwitcher.displayName = "ThemeSwitcher";
