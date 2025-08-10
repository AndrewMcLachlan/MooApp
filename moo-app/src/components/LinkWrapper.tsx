import { LinkComponent, NavLinkComponent } from "@andrewmclachlan/moo-ds";
import { Link, NavLink } from "react-router";

export const LinkWrapper: LinkComponent = ({ children, ...props }) => (
    <Link to={props.to} className={props.className} onClick={props.onClick} role={props.role}>
        {children}
    </Link>
);

export const NavLinkWrapper: NavLinkComponent = ({ children, ...props }) => (
    <NavLink to={props.to} className={props.className} onClick={props.onClick} role={props.role}>
        {children}
    </NavLink>
);