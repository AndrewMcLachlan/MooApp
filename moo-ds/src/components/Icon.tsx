import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { ElementType } from "react";
import { IconType } from "../types";

export const Icon: React.FC<IconProps> = ({ icon, onClick, title }) => {

    const CustomIconElement = icon as ElementType;

    const clickableClassName = onClick ? "clickable" : "";

    const IconNode = typeof icon === "function" ? <CustomIconElement className={classNames("custom-icon", clickableClassName)} onClick={onClick} title={title} /> : <FontAwesomeIcon icon={icon as IconProp} className={clickableClassName} onClick={onClick} title={title} />;

    return (
        <>{IconNode}</>
    );
}

export interface IconProps {
    icon?: IconType;
    onClick?: () => void;
    title?: string;
}

Icon.displayName = "Icon";
