import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { IconType } from "../types";
import { Icon } from "./Icon";


export const IconButton: React.FC<PropsWithChildren<IconButtonProps>> = ({ children, icon, className, ...button }) => (
    <Button className={classNames(className, "btn-icon")} {...button}><div><Icon icon={icon} /><span>{children}</span></div></Button>
);

export interface IconButtonProps extends ButtonProps {
    icon?: IconType;
}

IconButton.displayName = "IconButton";
