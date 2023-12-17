import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { ButtonProps } from "react-bootstrap";
import { Link, LinkProps } from "react-router-dom";

export const IconLinkButton: React.FC<PropsWithChildren<IconLinkButtonProps>> = ({ children, icon, ...link }) => (
    <Link {...link}><FontAwesomeIcon icon={icon} size="xs" />{children}</Link>
);

export interface IconLinkButtonProps extends Pick<FontAwesomeIconProps, "icon">, LinkProps, Pick<ButtonProps, "variant"> {
}