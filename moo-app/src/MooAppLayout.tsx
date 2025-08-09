import { Outlet, useLocation } from "react-router";

import { Alerts, Layout } from "@andrewmcolachlan/moo-ds";
import { HeaderProps, SidebarProps } from "@andrewmclachlan/moo-ds";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "./pages/Error";
import { Notifications } from "@andrewmclachlan/moo-ds";

export const MooAppLayout: React.FC<MooAppLayoutProps> = ({ header, sidebar }) => {

  const location = useLocation();

  return (
    <Layout size="small">
      <Alerts />
      <Notifications />
      <Layout.Header {...header} />
      <Layout.MobileHeader {...header} />
      <Layout.MobileSidebar {...sidebar} />
      <Layout.Sidebar {...sidebar} />
      <ErrorBoundary FallbackComponent={Error} resetKeys={[location.pathname]}>
        <Outlet />
      </ErrorBoundary>
    </Layout>
  );
};

export interface MooAppLayoutProps {
  header: HeaderProps;
  sidebar: SidebarProps;
}
