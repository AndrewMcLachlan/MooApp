import { Outlet } from "@tanstack/react-router";

// Layout route for a multi-page category: it renders nothing of its own, just
// the active page. The secondary nav is driven by each page's `navItems`, so
// this stays a plain outlet.
export const CategoryOutlet = () => <Outlet />;
