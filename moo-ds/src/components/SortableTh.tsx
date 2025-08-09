import { SortDirection } from "../models";
import React, { HTMLAttributes, PropsWithChildren } from "react";
import { SortIcon } from "./SortIcon";
import classNames from "classnames";

export const SortableTh: React.FC<PropsWithChildren<SortableThProps>> = ({field, sortField, sortDirection, onSort, className, children, onClick, ...rest}) => {

    const clickHandler = (e: React.MouseEvent<HTMLTableCellElement>, field: string) => {
        onSort(field);
        onClick?.(e);
    }

    return (
        <th className={classNames("sortable", className)} onClick={(e) => clickHandler(e, field)} {...rest}>
            {children}
            <SortIcon direction={sortDirection} hidden={field !== sortField} />
        </th>
    );
};

SortableTh.displayName = "SortableTh";

export interface SortableThProps extends HTMLAttributes<HTMLTableCellElement>  {
    field: string;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
}
