import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import type { ElementType } from "react";
import type { IconType } from "../types";

export const Icon: React.FC<IconProps> = ({ icon, src, onClick, title }) => {

    const CustomIconElement = icon as ElementType;

    const clickableClassName = onClick ? "clickable" : "";

    switch (typeof icon) {
        case "undefined":
            return src ? <img src={icon} alt={title} className={classNames("custom-icon", clickableClassName)} onClick={onClick} title={title} /> : null;
        case "function":
            return <CustomIconElement className={classNames("custom-icon", clickableClassName)} onClick={onClick} title={title} />
        default:
            return <FontAwesomeIcon icon={icon as IconProp} className={clickableClassName} onClick={onClick} title={title} />;
    }
}

export interface IconProps {
    icon?: IconType;
    src?: string;
    onClick?: () => void;
    title?: string;
}

Icon.displayName = "Icon";
