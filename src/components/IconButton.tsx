import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { ElementType, PropsWithChildren } from "react";
import { Button, ButtonProps } from "react-bootstrap";

export const IconButton: React.FC<PropsWithChildren<IconButtonProps>> = ({ children, icon, ...button }) => {

    const CustomIconElement = icon as ElementType;

    const IconNode = typeof icon === "function" ? <CustomIconElement className="custom-icon" /> : <FontAwesomeIcon icon={icon as IconProp} />;

    return (
        <Button {...button}>{IconNode}{children}</Button>
    );
}

export interface IconButtonProps extends ButtonProps {
    icon?: IconProp | ElementType;
}
