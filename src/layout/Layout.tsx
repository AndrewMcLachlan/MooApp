import { PropsWithChildren, useState } from "react";

import { DesktopFooterComponent, Footer } from "./Footer";
import { LayoutProvider } from "../providers";
import { size, Theme } from "../models/Layout";
import { DesktopHeaderComponent, Header } from "./Header";
import { MobileHeaderComponent, Header as MHeader } from "./Mobile/Header";
import { MobileFooterComponent, Footer as MFooter } from "./Mobile/Footer";
import classNames from "classnames";
import { Sidebar, SidebarComponent } from "./Sidebar";

export type LayoutComponent = React.FC<PropsWithChildren<LayoutProps>> & {
  Footer: DesktopFooterComponent;
  MobileFooter: MobileFooterComponent;
  Header: DesktopHeaderComponent;
  MobileHeader: MobileHeaderComponent;
  Sidebar: SidebarComponent;
};

const Layout: LayoutComponent = ({ size, children }) => {

  return (
    <LayoutProvider size={size}>
      <div className={classNames("app-container", `moo-${size}`)}>
        {children}
      </div>
    </LayoutProvider>
  );
};

Layout.defaultProps = {
  size: "default",
}

Layout.Footer = Footer;
Layout.MobileFooter = MFooter;
Layout.Header = Header;
Layout.MobileHeader = MHeader;
Layout.Sidebar = Sidebar;

export { Layout };

export interface LayoutProps {
  size?: size;
}