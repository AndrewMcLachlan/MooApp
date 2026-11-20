import { type IconType } from "../types";

export interface NavItem {
    id?: string;
    route?: string;
    text: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    icon?: IconType;
    /** An image URL, used when there is no `icon`. */
    iconSrc?: string;
}