import { describe, it, expect } from "vitest";
import { toTanStackColumns, type ColumnDef } from "../ColumnDef";

interface Row {
    name: string;
    age: number;
}

describe("toTanStackColumns", () => {
    describe("string field", () => {
        it("maps a string field to accessorKey", () => {
            const columns: ColumnDef<Row>[] = [{ field: "name", header: "Name" }];
            const result = toTanStackColumns(columns);
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({ accessorKey: "name", header: "Name" });
            expect(result[0]).not.toHaveProperty("field");
        });

        it("preserves extra TanStack column options", () => {
            const columns: ColumnDef<Row>[] = [
                { field: "name", header: "Name", enableSorting: false, meta: { hint: "x" } as any },
            ];
            const [col] = toTanStackColumns(columns);
            expect(col).toMatchObject({ accessorKey: "name", enableSorting: false });
        });
    });

    describe("function field", () => {
        it("maps a function field to accessorFn", () => {
            const fn = (r: Row) => `${r.name} (${r.age})`;
            const columns: ColumnDef<Row>[] = [{ field: fn, header: "Combined" }];
            const [col] = toTanStackColumns(columns);
            expect(col).toMatchObject({ accessorFn: fn });
            expect(col).not.toHaveProperty("field");
        });

        it("derives id from string header when no explicit id provided", () => {
            const columns: ColumnDef<Row>[] = [
                { field: (r) => r.age * 2, header: "Double Age" },
            ];
            const [col] = toTanStackColumns(columns);
            expect(col.id).toBe("double-age");
        });

        it("uses explicit id when supplied", () => {
            const columns: ColumnDef<Row>[] = [
                { field: (r) => r.age, id: "computed-age", header: "Age" },
            ];
            const [col] = toTanStackColumns(columns);
            expect(col.id).toBe("computed-age");
        });

        it("falls back to col-<index> when header is not a string", () => {
            const columns: ColumnDef<Row>[] = [
                { field: (r) => r.age, header: () => "Dynamic" },
            ];
            const [col] = toTanStackColumns(columns);
            expect(col.id).toBe("col-0");
        });

        it("deduplicates auto-generated ids when two function columns share a header", () => {
            const columns: ColumnDef<Row>[] = [
                { field: (r) => r.age, header: "Total" },
                { field: (r) => r.age * 2, header: "Total" },
            ];
            const result = toTanStackColumns(columns);
            expect(result[0].id).toBe("total");
            expect(result[1].id).toBe("total-1");
            expect(result[0].id).not.toBe(result[1].id);
        });

        it("deduplicates a function id against an existing accessor key", () => {
            const columns: ColumnDef<Row>[] = [
                { field: "name", header: "Name" },
                { field: (r) => r.name.toUpperCase(), id: "name", header: "Name (upper)" },
            ];
            const result = toTanStackColumns(columns);
            expect(result[0]).toMatchObject({ accessorKey: "name" });
            expect(result[1].id).toBe("name-1");
        });
    });
});
