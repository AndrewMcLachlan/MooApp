import classNames from "classnames";
import { type PropsWithChildren } from "react";
import { Button, type ButtonProps } from "./Button";
import { type IconType } from "../types";
import { Icon } from "./Icon";

export const IconButton: React.FC<PropsWithChildren<IconButtonProps>> = ({ children, icon, iconSrc: src, badge, className, ...button }) => (
    <Button className={classNames(className, "btn-icon", badge && "btn-icon-badge")} {...button}>
        {badge
            ? <span className="btn-icon-panel"><Icon icon={icon} src={src} /></span>
            : <Icon icon={icon} src={src} />}
        <span>{children}</span>
    </Button>
);

export interface IconButtonProps extends ButtonProps {
    icon?: IconType;
    iconSrc?: string;
    /** Render the icon in a full-height split panel on the left, divided from the label by a convex sweep (as in "Add" buttons). Designed for solid variants. */
    badge?: boolean;
}

IconButton.displayName = "IconButton";
