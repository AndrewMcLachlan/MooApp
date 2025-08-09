import { JSX, ReactNode } from "react";

export interface LinkComponent {
    (props: { 
        to?: string; 
        href?: string; 
        className?: string; 
        children: ReactNode; 
        [key: string]: any 
    }): JSX.Element;
}

export interface NavLinkComponent {
    (props: { 
        to?: string; 
        href?: string; 
        className?: string | ((props: { isActive: boolean }) => string); 
        children: ReactNode; 
        [key: string]: any 
    }): JSX.Element;
}