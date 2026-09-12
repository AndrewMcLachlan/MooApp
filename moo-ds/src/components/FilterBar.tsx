import classNames from "classnames";
import React, { type PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The one filter worth keeping on the bar rather than behind the button. */
    primary?: React.ReactNode;
    activeCount?: number;
    onOpenFilters: () => void;
    filtersLabel?: string;
    onClear?: () => void;
}

export const FilterBar: React.FC<PropsWithChildren<FilterBarProps>> = ({ primary, activeCount = 0, onOpenFilters, filtersLabel = "Filters", onClear, className, children, ...rest }) => {

    const hasChips = React.Children.count(children) > 0;

    return (
        <div className={classNames("filter-bar", className)} {...rest}>
            <div className="filter-bar-row">
                {primary && <div className="filter-bar-primary">{primary}</div>}
                <button
                    type="button"
                    className={classNames("filter-bar-button", activeCount > 0 && "active")}
                    onClick={onOpenFilters}
                >
                    <FontAwesomeIcon icon="filter" />
                    <span>{filtersLabel}</span>
                    {activeCount > 0 && <span className="filter-bar-count">{activeCount}</span>}
                </button>
            </div>
            {hasChips && (
                <div className="filter-bar-chips">
                    {children}
                    {onClear && <button type="button" className="filter-bar-clear" onClick={onClear}>Clear</button>}
                </div>
            )}
        </div>
    );
};

FilterBar.displayName = "FilterBar";
