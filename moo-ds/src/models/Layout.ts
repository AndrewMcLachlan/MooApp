import { type ReactNode } from "react";
import { type NavItem } from "./NavItem";
import { type PageAction } from "./PageAction";

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
    actions?: PageAction[];
    setActions?: (items: PageAction[]) => void;
    customActions?: ReactNode[];
    setCustomActions?: (items: ReactNode[]) => void;
    showSidebar?: boolean;
    setShowSidebar?: (show: boolean) => void;

    sidebarCollapsed?: boolean;
    setSidebarCollapsed?: (show: boolean) => void;
}
