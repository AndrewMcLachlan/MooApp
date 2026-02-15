import React, { PropsWithChildren } from "react";
import { SortIcon } from "../SortIcon";
import classNames from "classnames";
import { SortableThProps } from "../SortableTh";
import { PaginationThProps } from "./PaginationTh";
import { MiniPagination } from "./MiniPagination";

export const SortablePaginationTh: React.FC<PropsWithChildren<SortablePaginationThProps>> = ({ field, sortField, sortDirection, onSort, className, children, onClick, pageNumber, numberOfPages, onChange, ...rest }) => {

    const clickHandler = (e: React.MouseEvent<HTMLTableCellElement>, field: string) => {
        onSort(field);
        onClick?.(e);
    }

    return (
        <th className={classNames("sortable", className)} onClick={(e) => clickHandler(e, field)} {...rest}>
            <div className="pagination-th">
                <div>
                    {children}
                    <SortIcon direction={sortDirection} hidden={field !== sortField} />
                </div>
                <MiniPagination
                    pageNumber={pageNumber}
                    numberOfPages={numberOfPages}
                    onChange={onChange} />
            </div>
        </th>
    );
};

SortablePaginationTh.displayName = "SortablePaginationTh";

export interface SortablePaginationThProps extends Omit<SortableThProps, "onChange">, PaginationThProps {
}
