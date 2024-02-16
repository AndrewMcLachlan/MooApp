import { SortDirection } from "../models";
import React, { HTMLAttributes, PropsWithChildren } from "react";
import { SortIcon } from "./SortIcon";

export const SortableTh: React.FC<PropsWithChildren<SortableThProps>> = ({field, sortField, sortDirection, onSort, children}) => {

    return (
        <th className="sortable" onClick={() => onSort(field)}>
            {children}
            <SortIcon direction={sortDirection} hidden={field !== sortField} />
        </th>
    );
};

export interface SortableThProps extends HTMLAttributes<HTMLTableCellElement>  {
    field: string;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
}
