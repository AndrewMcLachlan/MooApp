import { Icon, type NavItem } from "@andrewmclachlan/moo-ds";
import {
    Bell,
    Cog, Dashboard, Database, Hierarchy, Information, List, Sliders, Sparkle, Stack, Tags, Transaction, User,
} from "@andrewmclachlan/moo-icons";

// Per-category page lists. Each multi-page category's pages pass its list to
// `<Page navItems={…}>`, which feeds the sidebar's secondary nav. Defining the
// lists here once keeps every page in a category showing the same secondary
// nav, so the pages themselves stay free of nav wiring.

export const layoutNav: NavItem[] = [
    { route: "/layout/page-sections", text: "Page & Sections", image: <Icon icon={Hierarchy} /> },
    { route: "/layout/dashboard", text: "Dashboard", image: <Icon icon={Dashboard} /> },
    { route: "/layout/navigation", text: "Navigation", image: <Icon icon={List} /> },
    { route: "/layout/drawer", text: "Drawer", image: <Icon icon={Sliders} /> },
];

export const formsNav: NavItem[] = [
    { route: "/forms/form", text: "Form", image: <Icon icon={List} /> },
    { route: "/forms/inputs", text: "Inputs", image: <Icon icon={List} /> },
    { route: "/forms/buttons", text: "Buttons", image: <Icon icon={Sliders} /> },
    { route: "/forms/combo-box", text: "ComboBox", image: <Icon icon={Tags} /> },
    { route: "/forms/tag-panel", text: "Tag Panel", image: <Icon icon={Tags} /> },
    { route: "/forms/upload", text: "Upload", image: <Icon icon={Stack} /> },
];

export const dataNav: NavItem[] = [
    { route: "/data/table", text: "Table", image: <Icon icon={Database} /> },
    { route: "/data/data-grid", text: "Data Grid", image: <Icon icon={Database} /> },
    { route: "/data/pagination", text: "Pagination", image: <Icon icon={List} /> },
    { route: "/data/kpi", text: "KPI", image: <Icon icon={Sparkle} /> },
];

export const feedbackNav: NavItem[] = [
    { route: "/feedback/alerts", text: "Alerts & Messages", image: <Icon icon={Bell} /> },
    { route: "/feedback/notifications", text: "Notifications", image: <Icon icon={Information} /> },
    { route: "/feedback/loading", text: "Loading", image: <Icon icon={Transaction} /> },
    { route: "/feedback/badges", text: "Badges", image: <Icon icon={Tags} /> },
];

export const appNav: NavItem[] = [
    { route: "/app/providers", text: "Providers & Theming", image: <Icon icon={Cog} /> },
    { route: "/app/error-handling", text: "Error Handling", image: <Icon icon={Cog} /> },
];

// The primary sidebar: the eight top-level categories. Multi-page categories
// point at their first page; single-page categories route straight through.
export const categoryNav: NavItem[] = [
    { text: "Home", route: "/", image: <Icon icon={Dashboard} /> },
    { text: "Layout", route: "/layout/page-sections", image: <Icon icon={Hierarchy} /> },
    { text: "Forms", route: "/forms/form", image: <Icon icon={List} /> },
    { text: "Data & Tables", route: "/data/table", image: <Icon icon={Database} /> },
    { text: "Feedback", route: "/feedback/alerts", image: <Icon icon={Stack} /> },
    { text: "Overlays", route: "/overlays", image: <Icon icon={Sliders} /> },
    { text: "Icons", route: "/icons", image: <Icon icon={Sparkle} /> },
    { text: "App Framework", route: "/app/providers", image: <Icon icon={Cog} /> },
];

// Header user-menu entries.
export const userMenu: NavItem[] = [
    { route: "/profile", text: "Profile", image: <Icon icon={User} /> },
    { route: "/settings", text: "Settings", image: <Icon icon={Sliders} /> },
];
