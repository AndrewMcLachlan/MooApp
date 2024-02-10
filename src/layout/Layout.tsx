import { PropsWithChildren } from "react";

import { Footer } from "./Desktop/Footer";
import { LayoutProvider, ThemeProvider } from "../providers";
import { size } from "../models/Layout";
import { Header } from "./Desktop/Header";
import { Header as MHeader } from "./Mobile/Header";
import { Footer as MFooter } from "./Mobile/Footer";
import { Sidebar as MSidebar } from "./Mobile/Sidebar";
import classNames from "classnames";
import { Sidebar } from "./Desktop/Sidebar";
import { FooterComponent, HeaderComponent, SidebarComponent } from "./Types";

export type LayoutComponent = React.FC<PropsWithChildren<LayoutProps>> & {
  Footer: FooterComponent;
  MobileFooter: FooterComponent;
  Header: HeaderComponent;
  MobileHeader: HeaderComponent;
  Sidebar: SidebarComponent;
  MobileSidebar: SidebarComponent;
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
Layout.MobileSidebar = MSidebar;

export { Layout };

export interface LayoutProps {
  size?: size;
}