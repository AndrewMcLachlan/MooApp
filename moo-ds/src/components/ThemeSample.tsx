import { type Theme } from "../models";

export const ThemeSample: React.FC<ThemeSampleProps> = ({ onClick, theme, selected }) => (

    <div className={`clickable theme-sample ${theme.theme === "" ? theme.name.toLowerCase() : theme.theme}${selected ? " selected" : ""}`} onClick={() => onClick(theme)}>
        <div className="theme-sample-preview" />
        <span className="theme-sample-name">{theme.name}</span>
        {selected && <span className="theme-sample-check">✓</span>}
    </div>
);

export interface ThemeSampleProps {
    theme: Theme;
    selected?: boolean;
    onClick: (theme: Theme) => void;
}