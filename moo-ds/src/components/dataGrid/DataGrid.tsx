import React, { ReactNode, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table";
import classNames from "classnames";
import { Table, TableProps } from "../Table";
import { SortIcon } from "../SortIcon";
import { LoadingTableRows } from "../LoadingTableRows";
import { Pagination } from "../pagination/Pagination";
import { PageSize } from "../pagination/PageSize";
import { PaginationControls } from "../pagination/PaginationControls";
import { SortDirection } from "../../models";

export interface DataGridProps<TData> extends Omit<TableProps, "children"> {
    // Data
    data: TData[];
    columns: ColumnDef<TData, any>[];

    // Sorting
    sortable?: boolean;
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    manualSorting?: boolean;

    // Pagination
    showPagination?: boolean;
    showPageSize?: boolean;
    pageSize?: number;
    pageSizes?: number[];
    pageIndex?: number;
    onPaginationChange?: OnChangeFn<PaginationState>;
    manualPagination?: boolean;
    rowCount?: number;

    // Loading / Empty
    loading?: boolean;
    loadingRows?: number;
    emptyMessage?: ReactNode;

    // Wrapper
    wrapperClassName?: string;
}

function DataGridInner<TData>(
    {
        data,
        columns,
        sortable = false,
        sorting: sortingProp,
        onSortingChange: onSortingChangeProp,
        manualSorting = false,
        showPagination = false,
        showPageSize = true,
        pageSize: pageSizeProp = 10,
        pageSizes = [10, 20, 50, 100],
        pageIndex: pageIndexProp,
        onPaginationChange: onPaginationChangeProp,
        manualPagination = false,
        rowCount,
        loading = false,
        loadingRows = 5,
        emptyMessage = "No data available.",
        wrapperClassName,
        ...tableProps
    }: DataGridProps<TData>,
    ref: React.ForwardedRef<HTMLTableElement>,
) {
    // Internal sorting state (used when uncontrolled)
    const [internalSorting, setInternalSorting] = useState<SortingState>([]);
    const sorting = sortingProp ?? internalSorting;
    const onSortingChange = onSortingChangeProp ?? setInternalSorting;

    // Internal pagination state (used when uncontrolled)
    const [internalPagination, setInternalPagination] = useState<PaginationState>({
        pageIndex: pageIndexProp ?? 0,
        pageSize: pageSizeProp,
    });
    const pagination = onPaginationChangeProp
        ? { pageIndex: pageIndexProp ?? 0, pageSize: pageSizeProp }
        : internalPagination;
    const onPaginationChange = onPaginationChangeProp ?? setInternalPagination;

    const table = useReactTable({
        data,
        columns,
        state: {
            ...(sortable ? { sorting } : {}),
            ...(showPagination ? { pagination } : {}),
        },
        onSortingChange: sortable ? onSortingChange : undefined,
        onPaginationChange: showPagination ? onPaginationChange : undefined,
        getCoreRowModel: getCoreRowModel(),
        ...(sortable && !manualSorting ? { getSortedRowModel: getSortedRowModel() } : {}),
        ...(showPagination && !manualPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
        ...(manualSorting ? { manualSorting: true } : {}),
        ...(manualPagination ? { manualPagination: true, rowCount } : {}),
    });

    const colCount = columns.length;
    const rows = table.getRowModel().rows;
    const hasRows = rows.length > 0;
    const showFooter = showPagination && !loading && hasRows;

    const getSortDirection = (tanstackDir: false | "asc" | "desc"): SortDirection => {
        return tanstackDir === "desc" ? "Descending" : "Ascending";
    };

    return (
        <div className={classNames("data-grid", wrapperClassName)}>
            <Table ref={ref} {...tableProps}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const canSort = sortable && header.column.getCanSort();
                                const sorted = header.column.getIsSorted();
                                return (
                                    <th
                                        key={header.id}
                                        className={classNames(canSort && "sortable")}
                                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        style={canSort ? { cursor: "pointer" } : undefined}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                        {canSort && (
                                            <SortIcon direction={getSortDirection(sorted)} hidden={!sorted} />
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {loading ? (
                        <LoadingTableRows rows={loadingRows} cols={colCount} />
                    ) : !hasRows ? (
                        <tr>
                            <td colSpan={colCount} className="data-grid-empty">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
                {showFooter && (
                    <tfoot>
                        <tr>
                            <td colSpan={colCount}>
                                <PaginationControls>
                                    {showPageSize && (
                                        <PageSize
                                            pageSizes={pageSizes}
                                            value={table.getState().pagination.pageSize}
                                            onChange={(newSize) => {
                                                table.setPageSize(newSize);
                                            }}
                                        />
                                    )}
                                    <Pagination
                                        pageNumber={table.getState().pagination.pageIndex + 1}
                                        numberOfPages={table.getPageCount()}
                                        onChange={(_current, newPage) => {
                                            table.setPageIndex(newPage - 1);
                                        }}
                                    />
                                </PaginationControls>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </Table>
        </div>
    );
}

export const DataGrid = React.forwardRef(DataGridInner) as <TData>(
    props: DataGridProps<TData> & React.RefAttributes<HTMLTableElement>,
) => React.ReactElement | null;

(DataGrid as any).displayName = "DataGrid";
