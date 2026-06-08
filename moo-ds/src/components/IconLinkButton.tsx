import { type PropsWithChildren } from "react";
import classNames from "classnames";
import { Icon } from "./Icon";
import { useLink } from "../providers/LinkProvider";
import type { IconButtonProps } from "./IconButton";

export const IconLinkButton: React.FC<PropsWithChildren<IconLinkButtonProps>> = ({ children, icon, iconSrc: src, variant, size, active, badge, className, ...link }) => {

    const Link = useLink();

    const classes = classNames(
        "btn",
        variant && `btn-${variant}`,
        size && `btn-${size}`,
        "btn-icon",
        badge && "btn-icon-badge",
        active && "active",
        className,
    );

    return (
        <Link {...link} className={classes}>
            {badge
                ? <span className="btn-icon-panel"><Icon icon={icon} src={src} /></span>
                : <Icon icon={icon} src={src} />}
            <span>{children}</span>
        </Link>
    );
};

export interface IconLinkButtonProps extends Omit<IconButtonProps, "as"> {
    to?: string;
    href?: string;
}

IconLinkButton.displayName = "IconLinkButton";
