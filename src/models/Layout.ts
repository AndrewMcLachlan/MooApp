import { ReactNode } from "react";
import { NavItem } from "./NavItem";

export type size = "small" | "default";

export interface LayoutOptions {
    size: size;
    photo?: string;
    breadcrumbs?: NavItem[];
    setBreadcrumbs?: (items: NavItem[]) => void;
    secondaryNav?: (NavItem|ReactNode)[];
    setSecondaryNav?: (items: (NavItem|ReactNode)[]) => void;
    actions?: ReactNode[];
    setActions?: (items: ReactNode[]) => void;
    showSidebar?: boolean;
    setShowSidebar?: (show: boolean) => void;
}
