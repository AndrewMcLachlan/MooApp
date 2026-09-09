import classNames from "classnames";
import React, { type PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FilterChipProps extends React.HTMLAttributes<HTMLSpanElement> {
    onRemove: () => void;
    /** Overrides the accessible name of the dismiss control, for a chip whose
        children are not plain text. */
    removeLabel?: string;
}

export const FilterChip: React.FC<PropsWithChildren<FilterChipProps>> = ({ onRemove, removeLabel, className, children, ...rest }) => (
    <span className={classNames("filter-chip", className)} {...rest}>
        <span className="filter-chip-label">{children}</span>
        <button
            type="button"
            className="filter-chip-remove"
            aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : "filter"}`}
            onClick={onRemove}
        >
            <FontAwesomeIcon icon="xmark" />
        </button>
    </span>
);

FilterChip.displayName = "FilterChip";
