export { DataGrid } from "./DataGrid";
export type { DataGridProps } from "./DataGrid";
// Re-export key TanStack types so consumers don't need a direct dependency
export { createColumnHelper } from "@tanstack/react-table";
export type { ColumnDef, SortingState, PaginationState } from "@tanstack/react-table";
