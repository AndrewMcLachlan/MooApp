import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { Button, ButtonProps } from "react-bootstrap";

export const IconButton: React.FC<PropsWithChildren<IconButtonProps>> = ({ children, icon, ...button }) => (
    <Button {...button}><FontAwesomeIcon icon={icon} size="xs" />{children}</Button>
);

export interface IconButtonProps extends Pick<FontAwesomeIconProps, "icon">, ButtonProps {
}