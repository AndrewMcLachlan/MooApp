import { Outlet } from "react-router-dom";

import { Alerts, Layout } from "layout";
import { ErrorBoundary } from "components";
import { FooterProps, HeaderProps, SidebarProps } from "layout/Types";

export const MooAppLayout: React.FC<MooAppLayoutProps> = ({ header, sidebar, footer }) => {

  return (
      <Layout size="small">
        <Alerts />
        <Layout.Header {...header} />
        <Layout.MobileHeader {...header} />
        <Layout.MobileSidebar {...sidebar} />
        <Layout.Sidebar {...sidebar} />
        <ErrorBoundary>
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