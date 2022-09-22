import { PropsWithChildren, useState } from "react";

import { DesktopFooterComponent, Footer } from "./Footer";
import { LayoutProvider } from "../providers";
import { Theme } from "../models/Layout";
import { DesktopHeaderComponent, Header } from "./Header";
import { Article, ArticleComponent } from "./Article";
import { MobileHeaderComponent, Header as MHeader } from "./Mobile/Header";
import { MobileFooterComponent, Footer as MFooter } from "./Mobile/Footer";

export type LayoutComponent = React.FC<PropsWithChildren<LayoutProps>> & {
  Footer: DesktopFooterComponent;
  MobileFooter: MobileFooterComponent;
  Header: DesktopHeaderComponent;
  MobileHeader: MobileHeaderComponent;
  Article: ArticleComponent;
};

const Layout: LayoutComponent = ({ children }) => {

  const [theme, setTheme] = useState<Theme>();

  const changeTheme = (theme?: Theme) => {
    setTheme(theme);
  }

  return (
    <LayoutProvider theme={theme} setTheme={changeTheme}>
      <main className={theme}>
        {children}
      </main>
    </LayoutProvider>
  );
};

Layout.Footer = Footer;
Layout.MobileFooter = MFooter;
Layout.Header = Header;
Layout.MobileHeader = MHeader;
Layout.Article = Article;

export { Layout };

export interface LayoutProps {

}