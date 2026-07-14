import React from "react";
import classNames from "classnames";
import { type SortDirection } from "../models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SortIcon: React.FC<SortIconProps> = ({ hidden = false, direction }) => {

    const icon = direction === "Ascending" ? "long-arrow-up" : "long-arrow-down";

    // Always render so the column reserves space; toggle visibility to avoid
    // layout shift when a sort is applied.
    return (
        <FontAwesomeIcon icon={icon} className={classNames("sort-icon", { "sort-icon-hidden": hidden })} />
    );
};

SortIcon.displayName = "SortIcon";

export interface SortIconProps {
    direction: SortDirection
    hidden?: boolean;
}
