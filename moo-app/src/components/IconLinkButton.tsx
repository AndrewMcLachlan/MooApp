import { PropsWithChildren } from "react";
import { ButtonProps } from "react-bootstrap";
import { Link, LinkProps } from "react-router-dom";
import { IconType } from "../types";
import { Icon } from "./Icon";

export const IconLinkButton: React.FC<PropsWithChildren<IconLinkButtonProps>> = ({ children, icon, variant, ...link }) => (
    <Link {...link} className={`btn ${variant && `btn-${variant}`} btn-icon `}><div><Icon icon={icon} /><span>{children}</span></div></Link>
);

export interface IconLinkButtonProps extends LinkProps, Pick<ButtonProps, "variant"> {
    icon?: IconType
}
