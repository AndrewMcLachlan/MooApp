import { HTMLAttributes } from "react";
import { Container } from "react-bootstrap";

export type DesktopFooterComponent = React.FC<FooterProps>;

export const Footer: DesktopFooterComponent = ({copyrightYear, ...rest}: FooterProps) => <footer className="d-none d-lg-flex" {...rest}><Container><span className="copyright">Copyright &copy; Andrew McLachlan {copyrightYear}. All rights reserved.</span><a href="http://www.andrewmclachlan.com">www.andrewmclachlan.com</a></Container></footer>

export interface FooterProps extends HTMLAttributes<HTMLElement> {
    copyrightYear: number;
}

Footer.displayName = "Footer";
