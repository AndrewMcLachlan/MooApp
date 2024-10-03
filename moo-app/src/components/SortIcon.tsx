import React from "react";
import { SortDirection } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SortIcon: React.FC<SortIconProps> = ({ hidden = false, ...props }) => {

    if (hidden) return null;

    const icon = props.direction === "Ascending" ? "long-arrow-up" : "long-arrow-down";

    return (
        <FontAwesomeIcon icon={icon} />
    );
};

export interface SortIconProps {
    direction: SortDirection
    hidden?: boolean;
}
