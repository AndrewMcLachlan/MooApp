import { Section, SectionDataGrid, DataGrid, Button, type ColumnDef, type DataGridState } from "@andrewmclachlan/moo-ds";
import { Page } from "@andrewmclachlan/moo-app";
import { useState, useCallback } from "react";

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
    const [serverPage, setServerPage] = useState(people.slice(0, 10));

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    const handleServerChange = useCallback((state: DataGridState) => {
        // Server-side simulation: sort and slice manually
        const sorted = [...people].sort((a, b) => {
            if (state.sorting.length === 0) return 0;
            const { id, desc } = state.sorting[0];
            const aVal = a[id as keyof Person];
            const bVal = b[id as keyof Person];
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return desc ? -cmp : cmp;
        });
        setServerPage(sorted.slice(
            state.pageIndex * state.pageSize,
            (state.pageIndex + 1) * state.pageSize,
        ));
    }, []);

    return (
        <Page title="Data Grid" breadcrumbs={[{ route: "/data-grid", text: "Data Grid" }]}>
            <SectionDataGrid header="Client-Side" headerSize={3} data={people} columns={columns} striped hover sortable showPagination pageSize={10} />

            <Section header="Loading State" headerSize={3}>
                <Button onClick={simulateLoading} disabled={isLoading} style={{ marginBottom: "1rem" }}>
                    {isLoading ? "Loading..." : "Simulate Loading"}
                </Button>
                <DataGrid data={people.slice(0, 5)} columns={columns} striped hover loading={isLoading} />
            </Section>

            <SectionDataGrid header="Empty State" headerSize={3} data={[]} columns={columns} striped hover emptyMessage="No people found. Try adjusting your filters." />

            <SectionDataGrid
                header="Server-Side Mode"
                headerSize={3}
                data={serverPage}
                columns={columns}
                striped
                hover
                sortable
                server
                showPagination
                pageSize={10}
                rowCount={people.length}
                onChange={handleServerChange}
            />

            <SectionDataGrid header="Header Pagination" headerSize={3} data={people} columns={columns} striped hover sortable showPagination showHeaderPagination pageSize={10} />

            <SectionDataGrid header="Bordered" headerSize={3} data={people.slice(0, 5)} columns={columns} bordered />
        </Page>
    );
};
