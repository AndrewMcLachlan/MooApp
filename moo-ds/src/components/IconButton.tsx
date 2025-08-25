import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { IconType } from "../types";
import { Icon } from "./Icon";

export const IconButton: React.FC<PropsWithChildren<IconButtonProps>> = ({ children, icon, iconSrc: src, className, ...button }) => (
    <Button className={classNames(className, "btn-icon")} {...button}><div><Icon icon={icon} src={src} /><span>{children}</span></div></Button>
);

export interface IconButtonProps extends ButtonProps {
    icon?: IconType;
    iconSrc?: string;
}

IconButton.displayName = "IconButton";
