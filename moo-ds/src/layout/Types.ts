import { NavItem } from "../models";
import { HTMLAttributes } from "react";
import { UserMenuProps } from "./UserMenu";

export type FooterComponent = React.FC<FooterProps>;
export type HeaderComponent = React.FC<HeaderProps>;
export type SidebarComponent = React.FC<React.PropsWithChildren<SidebarProps>>;

export interface HeaderProps extends UserMenuProps {
    search?: React.ReactNode;
    menu: React.ReactNode[];
};

export interface FooterProps extends HTMLAttributes<HTMLElement> {
    copyrightYear: number;
}

export interface SidebarProps {
    navItems?: NavItem[],
}
