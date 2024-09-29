import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ElementType } from "react";

export const Icon: React.FC<IconProps> = ({ icon }) => {

    const CustomIconElement = icon as ElementType;

    const IconNode = typeof icon === "function" ? <CustomIconElement className="custom-icon" /> : <FontAwesomeIcon icon={icon as IconProp} />;

    return (
        <>{IconNode}</>
    );
}

export interface IconProps {
    icon?: IconProp | ElementType;
}
