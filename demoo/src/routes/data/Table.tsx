import { Page } from "@andrewmclachlan/moo-app";
import { Section, SectionTable, EditColumn, SortableTh, changeSortDirection, type SortDirection, Button } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { dataNav } from "../../nav";

const rows = Array.from({ length: 6 }, (_, i) => ({ a: `Row ${i + 1} Data 1`, b: `Row ${i + 1} Data 2`, c: `Row ${i + 1} Data 3` }));

const people = [
    { name: "Alice", role: "Admin", logins: 42 },
    { name: "Bob", role: "Editor", logins: 17 },
    { name: "Charlie", role: "Viewer", logins: 8 },
    { name: "Diana", role: "Editor", logins: 31 },
    { name: "Eve", role: "Admin", logins: 25 },
];
type Person = typeof people[number];

export const TablePage = () => {

    const [tableValue, setTableValue] = useState<string | undefined>("Row 1 Data 1");
    const [tableNumValue, setTableNumValue] = useState<number | undefined>(1);
    const [isTableLoading, setIsTableLoading] = useState(false);

    const [sortField, setSortField] = useState<keyof Person>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("Ascending");

    const sort = (field: string) => {
        const nextDir = field === sortField ? changeSortDirection(sortDirection) : "Ascending";
        setSortField(field as keyof Person);
        setSortDirection(nextDir);
    };

    const sortedPeople = [...people].sort((a, b) => {
        const dir = sortDirection === "Ascending" ? 1 : -1;
        return a[sortField] < b[sortField] ? -dir : a[sortField] > b[sortField] ? dir : 0;
    });

    const simulateLoading = () => {
        setIsTableLoading(true);
        setTimeout(() => setIsTableLoading(false), 2000);
    };

    return (
        <Page title="Table" breadcrumbs={[{ route: "/data/table", text: "Data & Tables" }, { route: "/data/table", text: "Table" }]} navItems={dataNav}>

            <Section title="About" header="Table" headerSize={4}>
                <p>
                    <code>SectionTable</code> is a <code>Section</code> wrapping a styled table. It takes
                    the usual table markup and adds <code>striped</code>, <code>hover</code>, a loading
                    state, footers, group rows and inline-editable cells.
                </p>
            </Section>

            <SectionTable header="Striped &amp; hover, with editable cells" striped hover headerSize={4}>
                <thead>
                    <tr>
                        <th>Header 1 (text)</th>
                        <th>Header 2 (number)</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <EditColumn value={tableValue} onChange={e => setTableValue(e?.value)} />
                        <EditColumn type="number" value={tableNumValue ?? ""} onChange={e => setTableNumValue(Number.isNaN(e?.valueAsNumber) ? undefined : e?.valueAsNumber)} />
                        <td>Row 1 Data 3</td>
                    </tr>
                    {rows.slice(1).map((row) => (
                        <tr key={row.a}>
                            <td>{row.a}</td>
                            <td>{row.b}</td>
                            <td>{row.c}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Footer 1</td>
                        <td>Footer 2</td>
                        <td>Footer 3</td>
                    </tr>
                </tfoot>
            </SectionTable>

            <SectionTable header="Group rows" hover headerSize={4}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="group-row">
                        <td colSpan={3}>Group 1</td>
                    </tr>
                    {rows.slice(0, 3).map((row) => (
                        <tr key={`g1-${row.a}`}>
                            <td>{row.a}</td>
                            <td>{row.b}</td>
                            <td>{row.c}</td>
                        </tr>
                    ))}
                    <tr className="group-row">
                        <td colSpan={3}>Group 2</td>
                    </tr>
                    {rows.slice(3).map((row) => (
                        <tr key={`g2-${row.a}`}>
                            <td>{row.a}</td>
                            <td>{row.b}</td>
                            <td>{row.c}</td>
                        </tr>
                    ))}
                </tbody>
            </SectionTable>

            <SectionTable header="Sortable columns (SortableTh)" striped hover headerSize={4}>
                <thead>
                    <tr>
                        <SortableTh field="name" sortField={sortField} sortDirection={sortDirection} onSort={sort}>Name</SortableTh>
                        <SortableTh field="role" sortField={sortField} sortDirection={sortDirection} onSort={sort}>Role</SortableTh>
                        <SortableTh field="logins" sortField={sortField} sortDirection={sortDirection} onSort={sort}>Logins</SortableTh>
                    </tr>
                </thead>
                <tbody>
                    {sortedPeople.map((p) => (
                        <tr key={p.name}>
                            <td>{p.name}</td>
                            <td>{p.role}</td>
                            <td>{p.logins}</td>
                        </tr>
                    ))}
                </tbody>
            </SectionTable>

            <Section title="Loading rows" header="Loading rows" headerSize={4}>
                <p>While <code>loading</code> is set, the table renders shimmering placeholder rows in place of its data.</p>
                <Button onClick={simulateLoading} loading={isTableLoading}>
                    {isTableLoading ? "Loading" : "Simulate Loading"}
                </Button>
            </Section>

            <SectionTable header="Data Table" striped hover headerSize={4} loading={isTableLoading} loadingRows={5}>
                <thead>
                    <tr>
                        <th>Column A</th>
                        <th>Column B</th>
                        <th>Column C</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.slice(0, 5).map((row) => (
                        <tr key={row.a}>
                            <td>{row.a}</td>
                            <td>{row.b}</td>
                            <td>{row.c}</td>
                        </tr>
                    ))}
                </tbody>
            </SectionTable>

        </Page>
    );
}
