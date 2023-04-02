import { PropsWithChildren, useState } from "react";

import { DesktopFooterComponent, Footer } from "./Footer";
import { LayoutProvider } from "../providers";
import { size, Theme } from "../models/Layout";
import { DesktopHeaderComponent, Header } from "./Header";
import { Article, ArticleComponent } from "./Article";
import { MobileHeaderComponent, Header as MHeader } from "./Mobile/Header";
import { MobileFooterComponent, Footer as MFooter } from "./Mobile/Footer";
import classNames from "classnames";

export type LayoutComponent = React.FC<PropsWithChildren<LayoutProps>> & {
  Footer: DesktopFooterComponent;
  MobileFooter: MobileFooterComponent;
  Header: DesktopHeaderComponent;
  MobileHeader: MobileHeaderComponent;
  Article: ArticleComponent;
};

const Layout: LayoutComponent = ({ size, children }) => {

  const [theme, setTheme] = useState<Theme>();

  const changeTheme = (theme?: Theme) => {
    setTheme(theme);
  }

  return (
    <LayoutProvider theme={theme} setTheme={changeTheme} size={size}>
      <main className={classNames(`moo-${size}`)}>
        {children}
      </main>
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
Layout.Article = Article;

export { Layout };

export interface LayoutProps {
  size?: size;
}