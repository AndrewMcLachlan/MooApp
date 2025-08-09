import { Theme } from "../models";

export const ThemeSample: React.FC<ThemeSampleProps> = ({ onClick, theme }) => (

    <div className={`clickable theme-sample ${theme.theme == "" ? theme.name.toLowerCase() : theme.theme}`} onClick={() => onClick(theme)} />
);

export interface ThemeSampleProps {
    theme: Theme;
    onClick: (theme: Theme) => void;
}