import { useApp } from "providers";
import { HTMLAttributes } from "react";
import { Container } from "react-bootstrap";

export type DesktopFooterComponent = React.FC<FooterProps>;

export const Footer: DesktopFooterComponent = ({ copyrightYear, ...rest }: FooterProps) => {

    const { name, version } = useApp();

    return (
        <footer className="d-none d-lg-flex" {...rest}><Container>
            <span className="copyright">Copyright &copy; Andrew McLachlan {copyrightYear}. All rights reserved.</span>
            <span>{name} v{version}</span>
            <a href="http://www.andrewmclachlan.com">www.andrewmclachlan.com</a>
        </Container>
        </footer>
    );
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
    copyrightYear: number;

}

Footer.displayName = "Footer";
