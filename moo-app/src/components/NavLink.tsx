import type { NavLinkComponent } from "@andrewmclachlan/moo-ds";
import { Link } from "@tanstack/react-router"

export const NavLink: NavLinkComponent = ({ className, to, href, ...props }) => {

    let activeClassName: string;
    let baseClassName: string;
    if (className && typeof className === "function") {
        activeClassName = className({ isActive: true });
        baseClassName = className({ isActive: false });
    }
    else {
        activeClassName = className as string;
        baseClassName = className as string;
    }

    return (
        <Link className={baseClassName} activeProps={{className: activeClassName}} to={to || href || ""} {...props}>
            {props.children}
        </Link>
    );
}
