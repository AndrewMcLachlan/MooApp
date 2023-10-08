import { PropsWithChildren, useState } from "react";

import { DesktopFooterComponent, Footer } from "./Footer";
import { LayoutProvider, ThemeProvider } from "../providers";
import { size } from "../models/Layout";
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
    <ThemeProvider>
      <LayoutProvider size={size}>
        <div className={classNames("app-container", `moo-${size}`)}>
          {children}
        </div>
      </LayoutProvider>
    </ThemeProvider>
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