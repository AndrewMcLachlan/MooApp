import Form from "react-bootstrap/Form";
import { useLayout } from "../providers"

export const ThemeSwitcher = () => {

    const { theme, setTheme, defaultTheme } = useLayout();

    return (
        <Form.Check className="theme-switcher" type="switch" checked={theme === "light" || defaultTheme === "light"} onChange={e => setTheme(e.currentTarget.checked ? "light" : "dark")} />
    );
}