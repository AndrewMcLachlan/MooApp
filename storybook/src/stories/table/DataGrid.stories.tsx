import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DataGrid, type ColumnDef, type SortingState, type PaginationState } from "@andrewmclachlan/moo-ds";

interface Person {
    id: number;
    name: string;
    age: number;
    city: string;
    role: string;
}

const sampleData: Person[] = [
    { id: 1, name: "Alice", age: 30, city: "New York", role: "Engineer" },
    { id: 2, name: "Bob", age: 25, city: "London", role: "Designer" },
    { id: 3, name: "Charlie", age: 35, city: "Paris", role: "Manager" },
    { id: 4, name: "Diana", age: 28, city: "Tokyo", role: "Engineer" },
    { id: 5, name: "Eve", age: 22, city: "Berlin", role: "Intern" },
    { id: 6, name: "Frank", age: 41, city: "Sydney", role: "Director" },
    { id: 7, name: "Grace", age: 33, city: "Toronto", role: "Designer" },
    { id: 8, name: "Hank", age: 27, city: "Mumbai", role: "Engineer" },
    { id: 9, name: "Ivy", age: 29, city: "Seoul", role: "Manager" },
    { id: 10, name: "Jack", age: 38, city: "Dublin", role: "Engineer" },
    { id: 11, name: "Karen", age: 31, city: "Amsterdam", role: "Designer" },
    { id: 12, name: "Leo", age: 24, city: "Lisbon", role: "Intern" },
    { id: 13, name: "Mona", age: 36, city: "Vienna", role: "Manager" },
    { id: 14, name: "Nick", age: 42, city: "Oslo", role: "Director" },
    { id: 15, name: "Olivia", age: 26, city: "Prague", role: "Engineer" },
    { id: 16, name: "Paul", age: 34, city: "Warsaw", role: "Designer" },
    { id: 17, name: "Quinn", age: 23, city: "Helsinki", role: "Intern" },
    { id: 18, name: "Rita", age: 39, city: "Rome", role: "Manager" },
    { id: 19, name: "Steve", age: 32, city: "Madrid", role: "Engineer" },
    { id: 20, name: "Tina", age: 27, city: "Athens", role: "Designer" },
    { id: 21, name: "Uma", age: 30, city: "Bangkok", role: "Engineer" },
    { id: 22, name: "Victor", age: 45, city: "Cairo", role: "Director" },
    { id: 23, name: "Wendy", age: 29, city: "Lima", role: "Manager" },
    { id: 24, name: "Xander", age: 21, city: "Nairobi", role: "Intern" },
    { id: 25, name: "Yara", age: 37, city: "Jakarta", role: "Engineer" },
];

const columns: ColumnDef<Person, any>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "role", header: "Role" },
];

const meta = {
    title: "Moo App/Table/DataGrid",
    component: DataGrid,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        data: sampleData.slice(0, 5),
        columns,
        striped: true,
        hover: true,
    },
};

export const WithSorting: Story = {
    args: {
        data: sampleData.slice(0, 8),
        columns,
        striped: true,
        hover: true,
        sortable: true,
    },
};

export const WithPagination: Story = {
    args: {
        data: sampleData,
        columns,
        striped: true,
        hover: true,
        showPagination: true,
        pageSize: 10,
    },
};

export const SortingAndPagination: Story = {
    args: {
        data: sampleData,
        columns,
        striped: true,
        hover: true,
        sortable: true,
        showPagination: true,
        pageSize: 10,
    },
};

export const Loading: Story = {
    args: {
        data: [],
        columns,
        striped: true,
        hover: true,
        loading: true,
        loadingRows: 5,
    },
};

export const Empty: Story = {
    args: {
        data: [],
        columns,
        striped: true,
        hover: true,
    },
};

export const CustomEmptyMessage: Story = {
    args: {
        data: [],
        columns,
        striped: true,
        hover: true,
        emptyMessage: "No people found. Try adjusting your search criteria.",
    },
};

export const ServerSideMode: Story = {
    render: function Render() {
        const [sorting, setSorting] = useState<SortingState>([]);
        const [pagination, setPagination] = useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

        // Simulate server-side: apply sorting and pagination manually
        const sorted = [...sampleData].sort((a, b) => {
            if (sorting.length === 0) return 0;
            const { id, desc } = sorting[0];
            const aVal = a[id as keyof Person];
            const bVal = b[id as keyof Person];
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return desc ? -cmp : cmp;
        });

        const pageData = sorted.slice(
            pagination.pageIndex * pagination.pageSize,
            (pagination.pageIndex + 1) * pagination.pageSize,
        );

        return (
            <DataGrid
                data={pageData}
                columns={columns}
                striped
                hover
                sortable
                manualSorting
                sorting={sorting}
                onSortingChange={setSorting}
                showPagination
                manualPagination
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                rowCount={sampleData.length}
                onPaginationChange={setPagination}
            />
        );
    },
};

export const Bordered: Story = {
    args: {
        data: sampleData.slice(0, 5),
        columns,
        bordered: true,
    },
};

export const Responsive: Story = {
    args: {
        data: sampleData.slice(0, 5),
        columns,
        responsive: true,
        striped: true,
        hover: true,
    },
};
