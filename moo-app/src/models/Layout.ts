import { ReactNode } from "react";
import { NavItem } from "@andrewmclachlan/moo-ds";

export type size = "small" | "default";

export interface LayoutOptions {
    size: size;
}

export interface LayoutContext extends LayoutOptions {
    photo?: string;
    breadcrumbs?: NavItem[];
    setBreadcrumbs?: (items: NavItem[]) => void;
    secondaryNav?: (NavItem|ReactNode)[];
    setSecondaryNav?: (items: (NavItem|ReactNode)[]) => void;
    actions?: ReactNode[];
    setActions?: (items: ReactNode[]) => void;
    showSidebar?: boolean;
    setShowSidebar?: (show: boolean) => void;

    sidebarCollapsed?: boolean;
    setSidebarCollapsed?: (show: boolean) => void;
}
