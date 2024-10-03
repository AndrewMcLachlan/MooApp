import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { ElementType, PropsWithChildren } from "react";
import { ButtonProps } from "react-bootstrap";
import { Link, LinkProps } from "react-router-dom";

export const IconLinkButton: React.FC<PropsWithChildren<IconLinkButtonProps>> = ({ children, icon, variant, ...link }) => {

    const CustomIconElement = icon as ElementType;

    const IconNode = typeof icon === "function" ? <CustomIconElement className="custom-icon" /> : <FontAwesomeIcon icon={icon as IconProp} />;

    return (
        <Link {...link} className={`btn ${variant && `btn-${variant}`} btn-icon `}><div>{IconNode}<span>{children}</span></div></Link>
    );
};

export interface IconLinkButtonProps extends LinkProps, Pick<ButtonProps, "variant"> {
    icon?: IconProp | ElementType;
}
