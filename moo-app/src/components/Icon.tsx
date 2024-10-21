import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { ElementType } from "react";
import { IconType } from "../types";

export const Icon: React.FC<IconProps> = ({ icon, onClick }) => {

    const CustomIconElement = icon as ElementType;

    const clickableClassName = onClick ? "clickable" : "";

    const IconNode = typeof icon === "function" ? <CustomIconElement className={classNames("custom-icon", clickableClassName)} {...onClick} /> : <FontAwesomeIcon icon={icon as IconProp} className={clickableClassName} {...onClick} />;

    return (
        <>{IconNode}</>
    );
}

export interface IconProps {
    icon?: IconType;
    onClick?: () => void;
}

Icon.displayName = "Icon";
