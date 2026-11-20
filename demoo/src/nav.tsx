import { type NavItem } from "@andrewmclachlan/moo-ds";
import {
    Bell,
    Cog, Dashboard, Database, Hierarchy, Information, List, Sliders, Sparkle, Stack, Tags, Transaction, User,
} from "@andrewmclachlan/moo-icons";

// Per-category page lists. Each multi-page category's pages pass its list to
// `<Page navItems={…}>`, which feeds the sidebar's secondary nav. Defining the
// lists here once keeps every page in a category showing the same secondary
// nav, so the pages themselves stay free of nav wiring.

export const layoutNav: NavItem[] = [
    { route: "/layout/page-sections", text: "Page & Sections", icon: Hierarchy },
    { route: "/layout/page-actions", text: "Page actions", icon: Sliders },
    { route: "/layout/dashboard", text: "Dashboard", icon: Dashboard },
    { route: "/layout/navigation", text: "Navigation", icon: List },
    { route: "/layout/drawer", text: "Drawer", icon: Sliders },
    { route: "/layout/touch", text: "Touch", icon: Transaction },
];

export const formsNav: NavItem[] = [
    { route: "/forms/form", text: "Form", icon: List },
    { route: "/forms/inputs", text: "Inputs", icon: List },
    { route: "/forms/buttons", text: "Buttons", icon: Sliders },
    { route: "/forms/combo-box", text: "ComboBox", icon: Tags },
    { route: "/forms/tag-panel", text: "Tag Panel", icon: Tags },
    { route: "/forms/upload", text: "Upload", icon: Stack },
];

export const dataNav: NavItem[] = [
    { route: "/data/filtering", text: "Filtering", icon: Sliders },
    { route: "/data/table", text: "Table", icon: Database },
    { route: "/data/data-grid", text: "Data Grid", icon: Database },
    { route: "/data/pagination", text: "Pagination", icon: List },
    { route: "/data/kpi", text: "KPI", icon: Sparkle },
];

export const feedbackNav: NavItem[] = [
    { route: "/feedback/alerts", text: "Alerts & Messages", icon: Bell },
    { route: "/feedback/notifications", text: "Notifications", icon: Information },
    { route: "/feedback/loading", text: "Loading", icon: Transaction },
    { route: "/feedback/badges", text: "Badges", icon: Tags },
];

export const appNav: NavItem[] = [
    { route: "/app/providers", text: "Providers & Theming", icon: Cog },
    { route: "/app/error-handling", text: "Error Handling", icon: Cog },
];

// The primary sidebar: the eight top-level categories. Multi-page categories
// point at their first page; single-page categories route straight through.
export const categoryNav: NavItem[] = [
    { text: "Home", route: "/", icon: Dashboard },
    { text: "Layout", route: "/layout/page-sections", icon: Hierarchy },
    { text: "Forms", route: "/forms/form", icon: List },
    { text: "Data & Tables", route: "/data/table", icon: Database },
    { text: "Feedback", route: "/feedback/alerts", icon: Stack },
    { text: "Overlays", route: "/overlays", icon: Sliders },
    { text: "Icons", route: "/icons", icon: Sparkle },
    { text: "App Framework", route: "/app/providers", icon: Cog },
];

// Header user-menu entries.
export const userMenu: NavItem[] = [
    { route: "/profile", text: "Profile", icon: User },
    { route: "/settings", text: "Settings", icon: Sliders },
];
