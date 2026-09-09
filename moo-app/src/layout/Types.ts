import { type NavItem } from "@andrewmclachlan/moo-ds";
import { type HTMLAttributes } from "react";
import { type UserMenuProps } from "./UserMenu";

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
    /** The identity items the desktop header keeps in its user menu. The mobile
        shell has no band for them, so the drawer carries them instead. */
    userMenu?: NavItem[] | React.ReactNode[];
    menu?: React.ReactNode[];
}
