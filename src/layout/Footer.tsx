import { HTMLAttributes } from "react";

export type DesktopFooterComponent = React.FC<FooterProps>;

export const Footer: DesktopFooterComponent = ({copyrightYear, ...rest}: FooterProps) => <footer className="d-none d-lg-block" {...rest}>Copyright &copy; Andrew McLachlan {copyrightYear}. All rights reserved.<br /><a href="http://www.andrewmclachlan.com">www.andrewmclachlan.com</a></footer>;

export interface FooterProps extends HTMLAttributes<HTMLElement> {
    copyrightYear: number;
}

Footer.displayName = "Footer";
