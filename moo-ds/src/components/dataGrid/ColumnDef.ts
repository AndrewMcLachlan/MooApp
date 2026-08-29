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

/**
 * Simplified column definition that combines TanStack's `accessorKey` and
 * `accessorFn` into a single `field` property.
 *
 * - String `field` → maps to a property key on the row data, with `TValue`
 *   automatically inferred as `TData[K]`.
 * - Function `field` → computes the cell value from the row.
 *
 * When `field` is a function and no explicit `id` is provided, an id is
 * auto-generated from `header` (if it's a string) or the column index.
 *
 * `TData` is constrained to `RowData`: an object or an array.
 */
export type ColumnDef<TData extends RowData> =
    | { [K in keyof TData & string]: IdentifiedColumnDef<DataGridFeatures, TData, TData[K]> & { field: K } & DataGridColumnMeta }[keyof TData & string]
    | (IdentifiedColumnDef<DataGridFeatures, TData, unknown> & { field: (row: TData) => unknown } & DataGridColumnMeta);

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
        const { field, className, headerClassName, ...rest } = col;
        // Fold the top-level class props into meta rather than replacing it: both
        // spellings are legal, so assigning outright would silently drop a column
        // written as `meta: { className }`, and any other key a consumer has added
        // to DataGridColumnMeta. The explicit prop wins, but only where it is set —
        // an absent one must not blank out a value that came in through meta.
        const meta: DataGridColumnMeta = {
            ...rest.meta,
            ...(className !== undefined && { className }),
            ...(headerClassName !== undefined && { headerClassName }),
        };
        if (typeof field === "function") {
            const preferred = rest.id
                ?? (typeof rest.header === "string" && rest.header.length > 0
                    ? rest.header.toLowerCase().replace(/\s+/g, "-")
                    : `col-${index}`);
            return {
                ...rest,
                meta,
                id: claim(preferred, index),
                accessorFn: field,
            } as TanStackColumnDef<DataGridFeatures, TData, any>;
        }
        usedIds.add(rest.id ?? field);
        return {
            ...rest,
            meta,
            accessorKey: field,
        } as TanStackColumnDef<DataGridFeatures, TData, any>;
    });
}
