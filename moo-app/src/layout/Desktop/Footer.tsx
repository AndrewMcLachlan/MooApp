import { type FooterComponent } from "../Types";
import { useApp } from "../../providers";

export const Footer: FooterComponent = ({ copyrightYear, ...rest }) => {

    const { name, version } = useApp();

    return (
        <footer className="d-none d-lg-flex" {...rest}>
            <div className="container">
                <span className="copyright">Copyright &copy; Andrew McLachlan {copyrightYear}. All rights reserved.</span>
                <span>{name} v{version}</span>
                <a href="http://www.andrewmclachlan.com">www.andrewmclachlan.com</a>
            </div>
        </footer>
    );
}
