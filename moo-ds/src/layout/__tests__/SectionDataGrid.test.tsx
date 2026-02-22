import { describe, it, expect } from "vitest";
import { render, screen } from "../../test-utils";
import { SectionDataGrid } from "../SectionDataGrid";
import { ColumnDef } from "@tanstack/react-table";

interface Item {
    name: string;
    value: number;
}

const columns: ColumnDef<Item, any>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "value", header: "Value" },
];

const data: Item[] = [
    { name: "Alpha", value: 1 },
    { name: "Beta", value: 2 },
];

describe("SectionDataGrid", () => {
    describe("rendering without header", () => {
        it("renders DataGrid directly when no header", () => {
            render(
                <SectionDataGrid data={data} columns={columns} />,
            );

            expect(screen.getByRole("table")).toBeInTheDocument();
            expect(screen.getByRole("table")).toHaveClass("data-grid");
        });

        it("applies section class to data-grid table when no header", () => {
            render(
                <SectionDataGrid data={data} columns={columns} />,
            );

            expect(screen.getByRole("table")).toHaveClass("section");
        });

        it("applies custom className alongside section class", () => {
            render(
                <SectionDataGrid data={data} columns={columns} className="custom" />,
            );

            const table = screen.getByRole("table");
            expect(table).toHaveClass("section");
            expect(table).toHaveClass("custom");
        });
    });

    describe("rendering with header", () => {
        it("renders Section wrapper when header is provided", () => {
            const { container } = render(
                <SectionDataGrid data={data} columns={columns} header="Grid Title" />,
            );

            expect(container.querySelector(".section-table")).toBeInTheDocument();
        });

        it("renders header text", () => {
            render(
                <SectionDataGrid data={data} columns={columns} header="Grid Title" />,
            );

            expect(screen.getByText("Grid Title")).toBeInTheDocument();
        });

        it("renders DataGrid inside Section", () => {
            const { container } = render(
                <SectionDataGrid data={data} columns={columns} header="Title" />,
            );

            expect(container.querySelector(".section-table table.data-grid")).toBeInTheDocument();
        });
    });

    describe("headerSize prop", () => {
        it("applies headerSize to Section header", () => {
            const { container } = render(
                <SectionDataGrid data={data} columns={columns} header="Title" headerSize={3} />,
            );

            expect(container.querySelector("h3")).toBeInTheDocument();
        });
    });

    describe("DataGrid props pass-through", () => {
        it("passes through table appearance props", () => {
            render(
                <SectionDataGrid data={data} columns={columns} striped hover />,
            );

            expect(screen.getByRole("table")).toHaveClass("table-striped");
            expect(screen.getByRole("table")).toHaveClass("table-hover");
        });

        it("renders data rows", () => {
            render(
                <SectionDataGrid data={data} columns={columns} />,
            );

            expect(screen.getByText("Alpha")).toBeInTheDocument();
            expect(screen.getByText("Beta")).toBeInTheDocument();
        });
    });

    describe("displayName", () => {
        it("has displayName", () => {
            expect((SectionDataGrid as any).displayName).toBe("SectionDataGrid");
        });
    });
});
