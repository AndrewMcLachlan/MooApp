import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { ElementType, PropsWithChildren } from "react";
import { ButtonProps } from "react-bootstrap";
import { Link, LinkProps } from "react-router-dom";

export const IconLinkButton: React.FC<PropsWithChildren<IconLinkButtonProps>> = ({ children, icon, customIcon, variant, ...link }) => {

    const CustomIconElement = customIcon;

    const IconNode = (icon && <FontAwesomeIcon icon={icon} />) || (customIcon && <CustomIconElement className="custom-icon" />);

    return (
        <Link {...link} className={`btn ${variant && `btn-${variant}`} `}>{IconNode}{children}</Link>
    );
};

export interface IconLinkButtonProps extends LinkProps, Pick<ButtonProps, "variant"> {
    icon?: IconProp;
    customIcon?: ElementType;
}
