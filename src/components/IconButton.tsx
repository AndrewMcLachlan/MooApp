import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { ElementType, PropsWithChildren } from "react";
import { Button, ButtonProps } from "react-bootstrap";

export const IconButton: React.FC<PropsWithChildren<IconButtonProps>> = ({ children, icon, customIcon, ...button }) => {

    const CustomIconElement = customIcon;

    const IconNode = (icon && <FontAwesomeIcon icon={icon} />) || (customIcon && <CustomIconElement className="custom-icon" />);

    return (
        <Button {...button}>{IconNode}{children}</Button>
    );
}

export interface IconButtonProps extends ButtonProps {
    icon?: IconProp;
    customIcon?: ElementType;
}
