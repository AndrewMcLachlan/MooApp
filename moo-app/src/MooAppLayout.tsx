import { Outlet, useLocation } from "react-router-dom";

import { Alerts, Layout } from "./layout";
import { FooterProps, HeaderProps, SidebarProps } from "./layout/Types";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "pages/Error";

export const MooAppLayout: React.FC<MooAppLayoutProps> = ({ header, sidebar, footer }) => {

  const location = useLocation();

  return (
    <Layout size="small">
      <Alerts />
      <Layout.Header {...header} />
      <Layout.MobileHeader {...header} />
      <Layout.MobileSidebar {...sidebar} />
      <Layout.Sidebar {...sidebar} />
      <ErrorBoundary FallbackComponent={Error} resetKeys={[location.pathname]}>
        <Outlet />
      </ErrorBoundary>
      <Layout.Footer {...footer} />
    </Layout>
  );
};

export interface MooAppLayoutProps {
  header: HeaderProps;
  sidebar: SidebarProps;
  footer: FooterProps;
}
