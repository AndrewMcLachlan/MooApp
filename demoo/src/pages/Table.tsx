import { Section, NavItemDivider, IconButton, SectionTable, Pagination, PageSize, PaginationControls, SortablePaginationTh, changeSortDirection, SortDirection, Button, LoadingTableRows, MiniPagination } from "@andrewmclachlan/moo-ds";
import { Page } from "@andrewmclachlan/moo-app";
import { Tags } from "../assets";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const tableData = Array.from({ length: 100 }, (_, i) => ({ a: `Row ${i + 1} Data 1`, b: `Row ${i + 1} Data 2`, c: `Row ${i + 1} Data 3` }));

const miniTableData = [
    { name: "Alice", role: "Admin", status: "Active" },
    { name: "Bob", role: "Editor", status: "Active" },
    { name: "Charlie", role: "Viewer", status: "Inactive" },
    { name: "Diana", role: "Editor", status: "Active" },
    { name: "Eve", role: "Admin", status: "Active" },
    { name: "Frank", role: "Viewer", status: "Inactive" },
    { name: "Grace", role: "Editor", status: "Active" },
    { name: "Hank", role: "Viewer", status: "Active" },
];

export const Table = () => {

    const [tableValue, setTableValue] = useState<string | undefined>("Row 1 Data 1");
    const [tableNumValue, setTableNumValue] = useState<number | undefined>(1);

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortField, setSortField] = useState<string>("a");
    const [sortDirection, setSortDirection] = useState<SortDirection>("Ascending");

    const [isTableLoading, setIsTableLoading] = useState(false);
    const [miniPage, setMiniPage] = useState(1);

    const numberOfPages = Math.ceil(tableData.length / pageSize);
    const miniPageSize = 3;
    const miniNumberOfPages = Math.ceil(miniTableData.length / miniPageSize);

    const simulateLoading = () => {
        setIsTableLoading(true);
        setTimeout(() => setIsTableLoading(false), 2000);
    };

    return (
        <Page title="Table" breadcrumbs={[{ route: "/table", text: "Table" }]} navItems={[{ route: "/components/iconlinkbutton", image: <Tags />, text: "Icon Link Button" }, { route: "/components/iconbutton", image: <Tags />, text: "Icon Button" }, <NavItemDivider />,
        { route: "/components/tag-panel", image: <Tags />, text: "Tag Panel" }]} actions={[<IconButton icon={faPlus}>Create</IconButton>]}>
            <Section title="Paginated Table">
                <Button size="sm" variant="link">Sample</Button>
                <Button>Sample 2</Button>
                <Button variant="outline-primary">Sample 3</Button>
            </Section>

            <SectionTable header="Paginated Table" striped hover headerSize={2}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <SortablePaginationTh
                         sortDirection={sortDirection} sortField={sortField} field="c" onSort={(field) => { setSortField(field); setSortDirection(changeSortDirection(sortDirection)) }}
                         numberOfPages={numberOfPages} onChange={(_, newPage) => setPageNumber(newPage)  } pageNumber={pageNumber}>Header 3</SortablePaginationTh>
                    </tr>
                </thead>
                <tbody>
                    {tableData.slice((pageNumber-1) * pageSize, pageNumber*pageSize).map((row, index) => (
                        <tr key={row.a}>
                            <td>{row.a}</td>
                            <td>{row.b}</td>
                            <td>{row.c}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3}>
                        <PaginationControls>
                            <PageSize value={pageSize} onChange={(newPageSize) => { setPageSize(newPageSize); setPageNumber(1); }} />
                            <Pagination numberOfPages={numberOfPages} onChange={(_, newPage) => setPageNumber(newPage)  } pageNumber={pageNumber} />
                        </PaginationControls>
                        </td>
                    </tr>
                </tfoot>
            </SectionTable>

            <Section title="Loading Table Rows" header="Loading Table Rows" headerSize={4}>
                <Button onClick={simulateLoading} disabled={isTableLoading}>
                    {isTableLoading ? "Loading..." : "Simulate Loading"}
                </Button>
            </Section>

            <SectionTable header="Data Table" striped hover headerSize={2}>
                <thead>
                    <tr>
                        <th>Column A</th>
                        <th>Column B</th>
                        <th>Column C</th>
                    </tr>
                </thead>
                <tbody>
                    {isTableLoading ? (
                        <LoadingTableRows rows={5} cols={3} />
                    ) : (
                        tableData.slice(0, 5).map((row) => (
                            <tr key={row.a}>
                                <td>{row.a}</td>
                                <td>{row.b}</td>
                                <td>{row.c}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </SectionTable>

            <Section title="Mini Pagination" header="Mini Pagination" headerSize={4}>
                <SectionTable striped hover headerSize={2}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {miniTableData.slice((miniPage - 1) * miniPageSize, miniPage * miniPageSize).map((row) => (
                            <tr key={row.name}>
                                <td>{row.name}</td>
                                <td>{row.role}</td>
                                <td>{row.status}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}>
                                <MiniPagination pageNumber={miniPage} numberOfPages={miniNumberOfPages} onChange={(_, newPage) => setMiniPage(newPage)} />
                            </td>
                        </tr>
                    </tfoot>
                </SectionTable>
            </Section>
        </Page>
    );
}
