import type { NavItem, Theme, Themes } from "@andrewmclachlan/moo-ds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Sample items for ComboBox and TagPanel stories
 */
export interface SampleItem {
    id: number;
    name: string;
    color: string;
}

export const sampleItems: SampleItem[] = [
    { id: 1, name: "Red", color: "#FF0000" },
    { id: 2, name: "Blue", color: "#0000FF" },
    { id: 3, name: "Green", color: "#00FF00" },
    { id: 4, name: "Yellow", color: "#FFFF00" },
    { id: 5, name: "Purple", color: "#800080" },
];

/**
 * Sample NavItems for navigation component stories
 */
export const sampleNavItems: NavItem[] = [
    { id: "1", text: "Home", route: "/" },
    { id: "2", text: "About", route: "/about" },
    { id: "3", text: "Contact", route: "/contact" },
];

export const navItemsWithClick: NavItem[] = [
    { id: "1", text: "Action 1", onClick: () => console.log("Action 1 clicked") },
    { id: "2", text: "Action 2", onClick: () => console.log("Action 2 clicked") },
];

export const navItemsWithImages: NavItem[] = [
    { id: "1", text: "Dashboard", route: "/dashboard", image: <FontAwesomeIcon icon="home" /> },
    { id: "2", text: "Settings", route: "/settings", image: <FontAwesomeIcon icon="cog" /> },
    { id: "3", text: "Profile", route: "/profile", image: <FontAwesomeIcon icon="user" /> },
];

/**
 * Sample breadcrumbs
 */
export const sampleBreadcrumbs: NavItem[] = [
    { text: "Category", route: "/category" },
];

export const deepBreadcrumbs: NavItem[] = [
    { text: "Products", route: "/products" },
    { text: "Electronics", route: "/products/electronics" },
    { text: "Computers", route: "/products/electronics/computers" },
];

/**
 * Theme samples - re-exported for convenience
 */
export { Themes } from "@andrewmclachlan/moo-ds";

/**
 * Sample avatar URL
 */
export const sampleAvatarUrl = "https://i.pravatar.cc/150?img=39";
