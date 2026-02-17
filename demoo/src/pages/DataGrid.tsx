import { Section, DataGrid, Button, type ColumnDef, type SortingState, type PaginationState } from "@andrewmclachlan/moo-ds";
import { Page } from "@andrewmclachlan/moo-app";
import { useState } from "react";

interface Person {
    id: number;
    name: string;
    age: number;
    city: string;
    role: string;
}

const people: Person[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack"][i % 10],
    age: 20 + ((i * 7) % 30),
    city: ["New York", "London", "Paris", "Tokyo", "Berlin", "Sydney", "Toronto", "Mumbai", "Seoul", "Dublin"][i % 10],
    role: ["Engineer", "Designer", "Manager", "Director", "Intern"][i % 5],
}));

const columns: ColumnDef<Person, any>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "role", header: "Role" },
];

export const DataGridPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    // Server-side simulation: sort and slice manually
    const sorted = [...people].sort((a, b) => {
        if (sorting.length === 0) return 0;
        const { id, desc } = sorting[0];
        const aVal = a[id as keyof Person];
        const bVal = b[id as keyof Person];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return desc ? -cmp : cmp;
    });
    const serverPage = sorted.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize,
    );

    return (
        <Page title="Data Grid" breadcrumbs={[{ route: "/data-grid", text: "Data Grid" }]}>
            <Section title="Basic" header="Basic" headerSize={3}>
                <DataGrid data={people.slice(0, 5)} columns={columns} striped hover />
            </Section>

            <Section title="Client-Side Sorting" header="Client-Side Sorting" headerSize={3}>
                <DataGrid data={people.slice(0, 10)} columns={columns} striped hover sortable />
            </Section>

            <Section title="Client-Side Pagination" header="Client-Side Pagination" headerSize={3}>
                <DataGrid data={people} columns={columns} striped hover showPagination pageSize={10} />
            </Section>

            <Section title="Sorting + Pagination" header="Sorting + Pagination" headerSize={3}>
                <DataGrid data={people} columns={columns} striped hover sortable showPagination pageSize={10} />
            </Section>

            <Section title="Loading State" header="Loading State" headerSize={3}>
                <Button onClick={simulateLoading} disabled={isLoading} style={{ marginBottom: "1rem" }}>
                    {isLoading ? "Loading..." : "Simulate Loading"}
                </Button>
                <DataGrid data={people.slice(0, 5)} columns={columns} striped hover loading={isLoading} />
            </Section>

            <Section title="Empty State" header="Empty State" headerSize={3}>
                <DataGrid data={[]} columns={columns} striped hover />
            </Section>

            <Section title="Custom Empty Message" header="Custom Empty Message" headerSize={3}>
                <DataGrid data={[]} columns={columns} striped hover emptyMessage="No people found. Try adjusting your filters." />
            </Section>

            <Section title="Server-Side (Manual) Mode" header="Server-Side (Manual) Mode" headerSize={3}>
                <DataGrid
                    data={serverPage}
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
                    rowCount={people.length}
                    onPaginationChange={setPagination}
                />
            </Section>

            <Section title="Bordered" header="Bordered" headerSize={3}>
                <DataGrid data={people.slice(0, 5)} columns={columns} bordered />
            </Section>
        </Page>
    );
};
