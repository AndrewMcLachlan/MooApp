import { useTheme } from "../providers"
import { Themes } from "../models";
import { Col } from "./Col";
import { Row } from "./Row";
import { ThemeSample } from "./ThemeSample";

export const ThemeSelector = () => {

    const { setTheme } = useTheme();

    return (
        <Row>
            {Themes.map((theme) =>
                <Col key={theme.name} className="theme">
                    <h4>{theme.name}</h4>
                    <ThemeSample theme={theme} onClick={(t) => setTheme(t)} />
                </Col>
            )}
        </Row>
    );
}

ThemeSelector.displayName = "ThemeSelector";
