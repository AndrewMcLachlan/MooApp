import type { NavLinkComponent } from "@andrewmclachlan/moo-ds";
import { Link } from "@tanstack/react-router"

export const NavLink: NavLinkComponent = (props) => {

    let activeClassName: string;
    let className: string;
    if (props.className && typeof props.className === "function") {
        activeClassName = props.className({ isActive: true });
        className = props.className({ isActive: false });
    }
    else {
        activeClassName = props.className as string;
        className = props.className as string;
    }

    return (
        <Link className={className} activeProps={{className: activeClassName}} to={props.to || props.href}>
            {props.children}
        </Link>
    );
}
