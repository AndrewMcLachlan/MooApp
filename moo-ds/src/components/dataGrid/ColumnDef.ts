import type {
    ColumnDef as TanStackColumnDef,
    IdentifiedColumnDef,
    RowData,
} from "@tanstack/react-table";

declare module "@tanstack/table-core" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnDefBase<TData extends RowData, TValue> {
        /** Class applied to each `<td>` cell in this column. */
        className?: string;
        /** Class applied to the `<th>` header for this column. */
        headerClassName?: string;
    }
}

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
 */
export type ColumnDef<TData> =
    | { [K in keyof TData & string]: IdentifiedColumnDef<TData, TData[K]> & { field: K } }[keyof TData & string]
    | (IdentifiedColumnDef<TData, unknown> & { field: (row: TData) => unknown });

export function toTanStackColumns<TData>(columns: ColumnDef<TData>[]): TanStackColumnDef<TData, any>[] {
    return columns.map((col, index) => {
        const { field, ...rest } = col;
        if (typeof field === "function") {
            return {
                ...rest,
                id: rest.id ?? (typeof rest.header === "string" ? rest.header.toLowerCase().replace(/\s+/g, "-") : `col-${index}`),
                accessorFn: field,
            } as TanStackColumnDef<TData, any>;
        }
        return {
            ...rest,
            accessorKey: field,
        } as TanStackColumnDef<TData, any>;
    });
}
