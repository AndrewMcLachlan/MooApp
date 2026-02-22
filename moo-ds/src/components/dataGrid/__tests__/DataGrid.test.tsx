import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DataGrid } from "../DataGrid";
import { ColumnDef } from "@tanstack/react-table";

interface Person {
    name: string;
    age: number;
    city: string;
}

const columns: ColumnDef<Person, any>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "city", header: "City" },
];

const data: Person[] = [
    { name: "Alice", age: 30, city: "New York" },
    { name: "Bob", age: 25, city: "London" },
    { name: "Charlie", age: 35, city: "Paris" },
    { name: "Diana", age: 28, city: "Tokyo" },
    { name: "Eve", age: 22, city: "Berlin" },
];

const manyRows: Person[] = Array.from({ length: 25 }, (_, i) => ({
    name: `Person ${i + 1}`,
    age: 20 + i,
    city: `City ${i + 1}`,
}));

describe("DataGrid", () => {
    describe("rendering", () => {
        it("renders a table with headers and data rows", () => {
            render(<DataGrid data={data} columns={columns} />);

            expect(screen.getByRole("table")).toBeInTheDocument();
            expect(screen.getAllByRole("columnheader")).toHaveLength(3);
            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Age")).toBeInTheDocument();
            expect(screen.getByText("City")).toBeInTheDocument();

            expect(screen.getByText("Alice")).toBeInTheDocument();
            expect(screen.getByText("Bob")).toBeInTheDocument();
            expect(screen.getAllByRole("row")).toHaveLength(1 + data.length); // header + data
        });

        it("has displayName", () => {
            expect((DataGrid as any).displayName).toBe("DataGrid");
        });

        it("adds data-grid class to the table", () => {
            render(<DataGrid data={data} columns={columns} />);
            expect(screen.getByRole("table")).toHaveClass("data-grid");
        });
    });

    describe("table appearance props", () => {
        it("passes striped prop to Table", () => {
            render(<DataGrid data={data} columns={columns} striped />);
            expect(screen.getByRole("table")).toHaveClass("table-striped");
        });

        it("passes hover prop to Table", () => {
            render(<DataGrid data={data} columns={columns} hover />);
            expect(screen.getByRole("table")).toHaveClass("table-hover");
        });

        it("passes bordered prop to Table", () => {
            render(<DataGrid data={data} columns={columns} bordered />);
            expect(screen.getByRole("table")).toHaveClass("table-bordered");
        });

        it("passes responsive prop to Table", () => {
            const { container } = render(<DataGrid data={data} columns={columns} responsive />);
            expect(container.querySelector(".table-responsive")).toBeInTheDocument();
        });

        it("applies className alongside data-grid", () => {
            render(<DataGrid data={data} columns={columns} className="my-grid" />);
            const table = screen.getByRole("table");
            expect(table).toHaveClass("data-grid");
            expect(table).toHaveClass("my-grid");
        });
    });

    describe("empty state", () => {
        it("shows default empty message when data is empty", () => {
            render(<DataGrid data={[]} columns={columns} />);
            expect(screen.getByText("No data available.")).toBeInTheDocument();
        });

        it("shows custom empty message", () => {
            render(<DataGrid data={[]} columns={columns} emptyMessage="Nothing to see here" />);
            expect(screen.getByText("Nothing to see here")).toBeInTheDocument();
        });

        it("renders empty cell with correct colspan", () => {
            const { container } = render(<DataGrid data={[]} columns={columns} />);
            const td = container.querySelector("td.data-grid-empty");
            expect(td).toHaveAttribute("colspan", "3");
        });
    });

    describe("loading state", () => {
        it("renders loading rows when loading is true", () => {
            render(<DataGrid data={data} columns={columns} loading loadingRows={3} />);
            // Should show loading rows, not data rows
            expect(screen.queryByText("Alice")).not.toBeInTheDocument();
            // 1 header row + 3 loading rows
            const rows = screen.getAllByRole("row");
            expect(rows).toHaveLength(1 + 3);
        });

        it("defaults to 5 loading rows", () => {
            render(<DataGrid data={data} columns={columns} loading />);
            const rows = screen.getAllByRole("row");
            expect(rows).toHaveLength(1 + 5);
        });

        it("hides pagination when loading", () => {
            render(<DataGrid data={data} columns={columns} loading showPagination />);
            expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument();
        });
    });

    describe("client-side sorting", () => {
        it("adds sortable class to headers when sortable", () => {
            render(<DataGrid data={data} columns={columns} sortable />);
            const headers = screen.getAllByRole("columnheader");
            headers.forEach((h) => expect(h).toHaveClass("sortable"));
        });

        it("does not add sortable class when sortable is false", () => {
            render(<DataGrid data={data} columns={columns} />);
            const headers = screen.getAllByRole("columnheader");
            headers.forEach((h) => expect(h).not.toHaveClass("sortable"));
        });

        it("sorts data ascending then descending on click", () => {
            render(<DataGrid data={data} columns={columns} sortable />);

            const nameHeader = screen.getByText("Name");
            fireEvent.click(nameHeader);

            // After first click: ascending (Alice, Bob, Charlie, Diana, Eve — already sorted)
            const tbody = screen.getByRole("table").querySelector("tbody")!;
            let rows = within(tbody).getAllByRole("row");
            expect(rows[0]).toHaveTextContent("Alice");
            expect(rows[4]).toHaveTextContent("Eve");

            // Click again: descending
            fireEvent.click(nameHeader);
            rows = within(tbody).getAllByRole("row");
            expect(rows[0]).toHaveTextContent("Eve");
            expect(rows[4]).toHaveTextContent("Alice");
        });
    });

    describe("server-side sorting", () => {
        it("fires onChange when header is clicked", () => {
            const onChange = vi.fn();
            render(
                <DataGrid
                    data={data}
                    columns={columns}
                    sortable
                    server
                    onChange={onChange}
                />,
            );

            fireEvent.click(screen.getByText("Name"));
            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    sorting: [{ id: "name", desc: false }],
                    pageIndex: 0,
                    pageSize: 10,
                }),
            );
        });

        it("does not sort data internally", () => {
            render(
                <DataGrid
                    data={data}
                    columns={columns}
                    sortable
                    server
                    onChange={vi.fn()}
                />,
            );

            // Click to sort
            fireEvent.click(screen.getByText("Name"));

            // Data should be in original order since sorting is server-side
            const tbody = screen.getByRole("table").querySelector("tbody")!;
            const rows = within(tbody).getAllByRole("row");
            expect(rows[0]).toHaveTextContent("Alice");
            expect(rows[1]).toHaveTextContent("Bob");
        });
    });

    describe("client-side pagination", () => {
        it("renders pagination footer when showPagination is true", () => {
            const { container } = render(<DataGrid data={manyRows} columns={columns} showPagination pageSize={10} />);
            expect(container.querySelector("tfoot")).toBeInTheDocument();
        });

        it("renders page indicator, page size, full pagination and mini pagination", () => {
            const { container } = render(<DataGrid data={manyRows} columns={columns} showPagination pageSize={10} />);
            expect(screen.getByText("Page 1 of 3 (25 rows)")).toBeInTheDocument();
            expect(screen.getByText("Page Size")).toBeInTheDocument();
            // Full pagination has page number buttons
            expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
            // Mini pagination has prev/next
            expect(container.querySelector(".mini-pagination")).toBeInTheDocument();
        });

        it("uses custom dataType in page indicator", () => {
            render(<DataGrid data={manyRows} columns={columns} showPagination pageSize={10} dataType="people" />);
            expect(screen.getByText("Page 1 of 3 (25 people)")).toBeInTheDocument();
        });

        it("slices data to page size", () => {
            render(<DataGrid data={manyRows} columns={columns} showPagination pageSize={10} />);
            const tbody = screen.getByRole("table").querySelector("tbody")!;
            const rows = within(tbody).getAllByRole("row");
            expect(rows).toHaveLength(10);
        });

        it("navigates to next page", () => {
            render(<DataGrid data={manyRows} columns={columns} showPagination pageSize={10} />);

            // Click page 2
            const page2 = screen.getByRole("button", { name: "2" });
            fireEvent.click(page2);

            const tbody = screen.getByRole("table").querySelector("tbody")!;
            const rows = within(tbody).getAllByRole("row");
            expect(rows).toHaveLength(10);
            expect(rows[0]).toHaveTextContent("Person 11");
        });

        it("updates page indicator on navigation", () => {
            render(<DataGrid data={manyRows} columns={columns} showPagination pageSize={10} />);
            fireEvent.click(screen.getByRole("button", { name: "2" }));
            expect(screen.getByText("Page 2 of 3 (25 rows)")).toBeInTheDocument();
        });

        it("navigates to last page with remaining rows", () => {
            render(<DataGrid data={manyRows} columns={columns} showPagination pageSize={10} />);

            const page3 = screen.getByRole("button", { name: "3" });
            fireEvent.click(page3);

            const tbody = screen.getByRole("table").querySelector("tbody")!;
            const rows = within(tbody).getAllByRole("row");
            expect(rows).toHaveLength(5); // 25 total, page 3 has 5
        });

        it("does not show pagination when showPagination is false", () => {
            const { container } = render(<DataGrid data={manyRows} columns={columns} />);
            expect(container.querySelector("tfoot")).not.toBeInTheDocument();
        });

        it("does not show pagination footer when data is empty", () => {
            const { container } = render(<DataGrid data={[]} columns={columns} showPagination />);
            expect(container.querySelector("tfoot")).not.toBeInTheDocument();
        });
    });

    describe("header pagination", () => {
        it("renders mini pagination in the last header cell", () => {
            const { container } = render(
                <DataGrid data={manyRows} columns={columns} showHeaderPagination showPagination pageSize={10} />,
            );
            expect(container.querySelector(".pagination-th")).toBeInTheDocument();
        });

        it("shows both header and footer pagination", () => {
            const { container } = render(
                <DataGrid data={manyRows} columns={columns} showHeaderPagination showPagination pageSize={10} />,
            );
            // Header pagination
            expect(container.querySelector(".pagination-th")).toBeInTheDocument();
            // Footer pagination
            expect(container.querySelector("tfoot")).toBeInTheDocument();
        });

        it("shows header pagination without footer when showPagination is false", () => {
            const { container } = render(
                <DataGrid data={manyRows} columns={columns} showHeaderPagination pageSize={10} />,
            );
            expect(container.querySelector(".pagination-th")).toBeInTheDocument();
            expect(container.querySelector("tfoot")).not.toBeInTheDocument();
        });

        it("navigates with header mini pagination", () => {
            render(
                <DataGrid data={manyRows} columns={columns} showHeaderPagination pageSize={10} />,
            );

            const headerPagination = screen.getByTitle("Next page");
            fireEvent.click(headerPagination);

            const tbody = screen.getByRole("table").querySelector("tbody")!;
            const rows = within(tbody).getAllByRole("row");
            expect(rows[0]).toHaveTextContent("Person 11");
        });

        it("only adds pagination-th to the last header", () => {
            const { container } = render(
                <DataGrid data={manyRows} columns={columns} showHeaderPagination showPagination pageSize={10} />,
            );
            expect(container.querySelectorAll(".pagination-th")).toHaveLength(1);
        });
    });

    describe("server-side pagination", () => {
        it("fires onChange when page is changed", () => {
            const onChange = vi.fn();
            render(
                <DataGrid
                    data={manyRows.slice(0, 10)}
                    columns={columns}
                    showPagination
                    server
                    pageSize={10}
                    rowCount={25}
                    onChange={onChange}
                />,
            );

            const page2 = screen.getByRole("button", { name: "2" });
            fireEvent.click(page2);
            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    sorting: [],
                    pageIndex: 1,
                    pageSize: 10,
                }),
            );
        });

        it("calculates correct page count from rowCount", () => {
            render(
                <DataGrid
                    data={manyRows.slice(0, 10)}
                    columns={columns}
                    showPagination
                    server
                    pageSize={10}
                    rowCount={25}
                    onChange={vi.fn()}
                />,
            );

            // Should show page 3 button (25 / 10 = 3 pages)
            expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        });
    });
});
