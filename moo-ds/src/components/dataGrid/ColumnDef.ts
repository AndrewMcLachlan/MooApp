import type { ReactNode } from "react";
import {
    tableFeatures,
    metaHelper,
    rowSortingFeature,
    rowPaginationFeature,
    createSortedRowModel,
    createPaginatedRowModel,
    sortFns,
    type ColumnDef as TanStackColumnDef,
    type IdentifiedColumnDef,
    type RowData,
} from "@tanstack/react-table";

/**
 * Per-column classes, reaching TanStack as `columnDef.meta`.
 *
 * Consumers write `className` at the top level of a column;
 * `toTanStackColumns` folds it into `meta`.
 */
export interface DataGridColumnMeta {
    /** Class applied to each `<td>` cell in this column. */
    className?: string;
    /** Class applied to the `<th>` header for this column. */
    headerClassName?: string;
}

/**
 * The feature set the DataGrid registers.
 *
 * v9 is opt-in: an unregistered feature's options and methods do not exist, so
 * this list is exactly what DataGrid uses.
 */
export const dataGridFeatures = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortFns,
    columnMeta: metaHelper<DataGridColumnMeta>(),
});

export type DataGridFeatures = typeof dataGridFeatures;

/** What a column can resolve to: a value that can be compared, and therefore sorted. */
export type CellValue = string | number | boolean | Date | null | undefined;

/** What a `cell` renderer is handed: the row itself, and the resolved value. */
export interface CellContext<TData extends RowData> {
    row: TData;
    value: CellValue;
}

/**
 * Simplified column definition.
 *
 * `field` resolves the column's value and nothing else — a key of the row, or
 * a function computing one. `cell` renders that value. Omit `field` for a
 * display column (a checkbox, a link); `value` is then undefined and there is
 * nothing to sort on, so give it an `id`.
 *
 * When `field` is a function and no explicit `id` is provided, an id is
 * auto-generated from `header` (if it's a string) or the column index.
 *
 * `TData` is constrained to `RowData`: an object or an array.
 *
 * One shape, not a union of key-typed and function-typed columns. A union
 * gives TypeScript nothing to discriminate an object literal on, and it then
 * declines to contextually type sibling properties — which leaves every `cell`
 * callback's argument an implicit `any` for consumers to annotate by hand.
 */
export type ColumnDef<TData extends RowData> =
    Omit<IdentifiedColumnDef<DataGridFeatures, TData, CellValue>, "cell">
    & {
        field?: (keyof TData & string) | ((row: TData) => CellValue);
        cell?: (context: CellContext<TData>) => ReactNode;
    }
    & DataGridColumnMeta;

export function toTanStackColumns<TData extends RowData>(columns: ColumnDef<TData>[]): TanStackColumnDef<DataGridFeatures, TData, any>[] {
    const usedIds = new Set<string>();
    const claim = (preferred: string, index: number): string => {
        let id = preferred;
        if (usedIds.has(id)) {
            id = `${preferred}-${index}`;
            // Extremely defensive: also collide on suffix
            let suffix = index;
            while (usedIds.has(id)) {
                suffix += 1;
                id = `${preferred}-${suffix}`;
            }
        }
        usedIds.add(id);
        return id;
    };

    return columns.map((col, index) => {
        const { field, className, headerClassName, cell, ...rest } = col;
        // Merge, do not assign: both spellings are legal, so assigning would
        // silently drop a column written as `meta: { className }`. The explicit
        // prop wins only where it is set.
        const meta: DataGridColumnMeta = {
            ...rest.meta,
            ...(className !== undefined && { className }),
            ...(headerClassName !== undefined && { headerClassName }),
        };
        // Adapt to TanStack's cell context so consumers see `{ row, value }`
        // rather than a getter and a row wrapper.
        const cellRenderer = cell === undefined
            ? undefined
            : (context: { row: { original: TData }; getValue: () => unknown }) =>
                cell({ row: context.row.original, value: context.getValue() as CellValue });

        if (field === undefined || typeof field === "function") {
            const preferred = rest.id
                ?? (typeof rest.header === "string" && rest.header.length > 0
                    ? rest.header.toLowerCase().replace(/\s+/g, "-")
                    : `col-${index}`);
            return {
                ...rest,
                meta,
                ...(cellRenderer && { cell: cellRenderer }),
                id: claim(preferred, index),
                // A display column has no value to resolve, so it gets no accessor.
                ...(field !== undefined && { accessorFn: field }),
            } as TanStackColumnDef<DataGridFeatures, TData, any>;
        }
        usedIds.add(rest.id ?? field);
        return {
            ...rest,
            meta,
            ...(cellRenderer && { cell: cellRenderer }),
            accessorKey: field,
        } as TanStackColumnDef<DataGridFeatures, TData, any>;
    });
}
