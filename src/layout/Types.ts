import { NavItem } from "models";
import { HTMLAttributes } from "react";

export type FooterComponent = React.FC<FooterProps>;
export type HeaderComponent = React.FC<HeaderProps>;
export type SidebarComponent = React.FC<React.PropsWithChildren<SidebarProps>>;


export interface HeaderProps {
    Search?: React.ReactNode;
    Menu: React.ReactNode[];
};

export interface FooterProps extends HTMLAttributes<HTMLElement> {
    copyrightYear: number;

}

export interface SidebarProps {
    navItems?: NavItem[],
}
