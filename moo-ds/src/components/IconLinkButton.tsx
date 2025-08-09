import { PropsWithChildren } from "react";
import { ButtonProps } from "react-bootstrap";
import { IconType } from "../types";
import { Icon } from "./Icon";
import { useLink } from "../providers/LinkProvider";

export const IconLinkButton: React.FC<PropsWithChildren<IconLinkButtonProps>> = ({ children, icon, variant, ...link }) => {

    const Link = useLink();

    return (
        <Link {...link} className={`btn ${variant && `btn-${variant}`} btn-icon `}>
            <div>
                <Icon icon={icon} />
                <span>{children}</span>
            </div>
        </Link>
    );
};

export interface IconLinkButtonProps {
    icon?: IconType;
    variant?: ButtonProps["variant"];
    to?: string;
    href?: string;
}
