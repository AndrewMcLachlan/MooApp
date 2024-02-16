import React from "react";
import { SortDirection } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SortIcon: React.FC<SortIconProps> = (props) => {

    if (props.hidden) return null;

    const icon = props.direction === "Ascending" ? "long-arrow-up" : "long-arrow-down";

    return (
        <FontAwesomeIcon icon={icon} />
    );
};

SortIcon.defaultProps = {
    hidden: false
}

export interface SortIconProps {
    direction: SortDirection
    hidden?: boolean;
}