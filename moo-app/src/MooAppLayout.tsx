import { Outlet, useLocation } from "react-router";

import { Alerts, Layout } from "./layout";
import { HeaderProps, SidebarProps } from "./layout/Types";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "./pages/Error";
import { Notifications } from "./layout/Notifications";

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
