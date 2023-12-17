import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { Link, LinkProps } from "react-router-dom";

export const IconLink: React.FC<PropsWithChildren<IconLinkProps>> = ({ children, icon, ...link }) => (
    <Link {...link}><FontAwesomeIcon icon={icon} size="xs" />{children}</Link>
);

export interface IconLinkProps extends Pick<FontAwesomeIconProps, "icon">, LinkProps {
}