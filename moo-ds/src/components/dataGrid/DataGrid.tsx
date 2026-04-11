import React, { type ReactNode, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    type SortingState,
    type PaginationState,
    type OnChangeFn,
} from "@tanstack/react-table";
import { type ColumnDef, toTanStackColumns } from "./ColumnDef";
import classNames from "classnames";
import { className as classNameProp } from "../../utils/className";
import { Table, type TableProps } from "../Table";
import { SortableTh } from "../SortableTh";
import { LoadingTableRows } from "../LoadingTableRows";
import { Pagination } from "../pagination/Pagination";
import { MiniPagination } from "../pagination/MiniPagination";
import { PaginationTh } from "../pagination/PaginationTh";
import { SortablePaginationTh } from "../pagination/SortablePaginationTh";
import { PageSize } from "../pagination/PageSize";
import { PageIndicator } from "../pagination/PageIndicator";
import { PaginationControls } from "../pagination/PaginationControls";
import { type SortDirection } from "../../models";

export interface DataGridState {
    sorting: SortingState;
    pageIndex: number;
    pageSize: number;
}

export interface DataGridProps<TData> extends Omit<TableProps, "children" | "onChange"> {
    // Data
    data: TData[];
    columns: ColumnDef<TData>[];

    // Server-side mode
    server?: boolean;
    onChange?: (state: DataGridState) => void;

    // Sorting
    sortable?: boolean;

    // Pagination
    showPagination?: boolean;
    showHeaderPagination?: boolean;
    dataType?: string;
    pageSize?: number;
    pageSizes?: number[];
    rowCount?: number;

    // Loading / Empty
    loading?: boolean;
    loadingRows?: number;
    emptyMessage?: ReactNode;

}

function DataGridInner<TData>(
    {
        data,
        columns,
        server = false,
        onChange,
        sortable = false,
        showPagination = false,
        showHeaderPagination = false,
        dataType = "rows",
        pageSize: pageSizeProp = 10,
        pageSizes = [10, 20, 50, 100],
        rowCount,
        loading = false,
        loadingRows = 5,
        emptyMessage = "No data available.",
        className,
        ...tableProps
    }: DataGridProps<TData>,
    ref: React.ForwardedRef<HTMLTableElement>,
) {
    const tanStackColumns = toTanStackColumns(columns);

    const [internalSorting, setInternalSorting] = useState<SortingState>([]);
    const [internalPagination, setInternalPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: pageSizeProp,
    });

    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        setInternalSorting((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            if (server && onChange) {
                onChange({ sorting: next, pageIndex: internalPagination.pageIndex, pageSize: internalPagination.pageSize });
            }
            return next;
        });
    };

    const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
        setInternalPagination((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            if (server && onChange) {
                onChange({ sorting: internalSorting, pageIndex: next.pageIndex, pageSize: next.pageSize });
            }
            return next;
        });
    };

    const hasPagination = showPagination || showHeaderPagination;

    const table = useReactTable({
        data,
        columns: tanStackColumns,
        state: {
            ...(sortable ? { sorting: internalSorting } : {}),
            ...(hasPagination ? { pagination: internalPagination } : {}),
        },
        onSortingChange: sortable ? handleSortingChange : undefined,
        onPaginationChange: hasPagination ? handlePaginationChange : undefined,
        getCoreRowModel: getCoreRowModel(),
        ...(sortable && !server ? { getSortedRowModel: getSortedRowModel() } : {}),
        ...(hasPagination && !server ? { getPaginationRowModel: getPaginationRowModel() } : {}),
        ...(server ? { manualSorting: true, manualPagination: true, rowCount } : {}),
    });

    const colCount = columns.length;
    const rows = table.getRowModel().rows;
    const hasRows = rows.length > 0;
    const showFooter = showPagination && !loading && hasRows;
    const hasHeaderPagination = showHeaderPagination && !loading && hasRows;

    const pageNumber = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();

    const sortField = internalSorting[0]?.id ?? "";
    const sortDirection: SortDirection = internalSorting[0]?.desc ? "Descending" : "Ascending";

    const handleSort = (field: string) => {
        const currentSort = internalSorting.find(s => s.id === field);
        const newSorting: SortingState = currentSort
            ? currentSort.desc ? [] : [{ id: field, desc: true }]
            : [{ id: field, desc: false }];
        handleSortingChange(newSorting);
    };

    const handlePageChange = (_current: number, newPage: number) => {
        table.setPageIndex(newPage - 1);
    };

    return (
            <Table ref={ref} className={classNames("data-grid", className)} {...tableProps}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header, headerIndex) => {
                                const canSort = sortable && header.column.getCanSort();
                                const isLastHeader = headerIndex === headerGroup.headers.length - 1;
                                const hasPaginationTh = hasHeaderPagination && isLastHeader;
                                const headerClass = classNameProp(header.column.columnDef.headerClassName);

                                const headerContent = header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext());

                                if (canSort && hasPaginationTh) {
                                    return (
                                        <SortablePaginationTh
                                            key={header.id}
                                            {...headerClass}
                                            field={header.id}
                                            sortField={sortField}
                                            sortDirection={sortDirection}
                                            onSort={handleSort}
                                            pageNumber={pageNumber}
                                            numberOfPages={pageCount}
                                            onChange={handlePageChange}
                                        >
                                            {headerContent}
                                        </SortablePaginationTh>
                                    );
                                }

                                if (canSort) {
                                    return (
                                        <SortableTh
                                            key={header.id}
                                            {...headerClass}
                                            field={header.id}
                                            sortField={sortField}
                                            sortDirection={sortDirection}
                                            onSort={handleSort}
                                        >
                                            {headerContent}
                                        </SortableTh>
                                    );
                                }

                                if (hasPaginationTh) {
                                    return (
                                        <PaginationTh
                                            key={header.id}
                                            {...headerClass}
                                            pageNumber={pageNumber}
                                            numberOfPages={pageCount}
                                            onChange={handlePageChange}
                                        >
                                            {headerContent}
                                        </PaginationTh>
                                    );
                                }

                                return (
                                    <th key={header.id} {...headerClass}>
                                        {headerContent}
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
                                    <td key={cell.id} {...classNameProp(cell.column.columnDef.className)}>
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
                                    <PageIndicator pageNumber={pageNumber} pageCount={pageCount} totalRows={rowCount ?? data.length} dataType={dataType} />
                                    <PageSize
                                        pageSizes={pageSizes}
                                        value={table.getState().pagination.pageSize}
                                        onChange={(newSize) => {
                                            table.setPageSize(newSize);
                                        }}
                                    />
                                    <Pagination
                                        pageNumber={pageNumber}
                                        numberOfPages={pageCount}
                                        onChange={handlePageChange}
                                    />
                                    <MiniPagination
                                        pageNumber={pageNumber}
                                        numberOfPages={pageCount}
                                        onChange={handlePageChange}
                                    />
                                </PaginationControls>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </Table>
    );
}

export const DataGrid = React.forwardRef(DataGridInner) as <TData>(
    props: DataGridProps<TData> & React.RefAttributes<HTMLTableElement>,
) => React.ReactElement | null;

(DataGrid as any).displayName = "DataGrid";
