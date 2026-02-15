import React, { PropsWithChildren } from "react";
import { Badge, BadgeProps } from "./Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

export const CloseBadge: React.FC<PropsWithChildren<CloseBadgeProps>> = (props) => {

    const click = (e: React.MouseEvent<any, any>) => {
        e.defaultPrevented = true;
        e.stopPropagation();

        props.onClose?.();
    }

    const { className, ...other } = props;

    return (<Badge {...other} className={classNames(className, "close-badge")}>{props.children}<FontAwesomeIcon icon="times-circle" onClick={click} /></Badge>);
}

CloseBadge.displayName = "CloseBadge";

export interface CloseBadgeProps extends BadgeProps {
    onClose?: () => void;
}
