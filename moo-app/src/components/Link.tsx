import type { LinkComponent } from "@andrewmclachlan/moo-ds";
import { Link as TSLink } from "@tanstack/react-router"

export const Link: LinkComponent = ({ to, href, ...props }) => {

    return (
        <TSLink to={to || href || ""} {...props}>
            {props.children}
        </TSLink>
    );
}
