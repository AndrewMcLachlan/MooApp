import { Page } from "@andrewmclachlan/moo-app";
import { Section, SectionTable, Pagination, PageSize, PaginationControls, SortablePaginationTh, changeSortDirection, type SortDirection, MiniPagination } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { dataNav } from "../../nav";

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

export const PaginationPage = () => {

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortField, setSortField] = useState<string>("a");
    const [sortDirection, setSortDirection] = useState<SortDirection>("Ascending");
    const [miniPage, setMiniPage] = useState(1);

    const numberOfPages = Math.ceil(tableData.length / pageSize);
    const miniPageSize = 3;
    const miniNumberOfPages = Math.ceil(miniTableData.length / miniPageSize);

    return (
        <Page title="Pagination" breadcrumbs={[{ route: "/data/table", text: "Data & Tables" }, { route: "/data/pagination", text: "Pagination" }]} navItems={dataNav}>

            <Section title="About" header="Pagination" headerSize={4}>
                <p>
                    <code>PaginationControls</code> pairs a <code>PageSize</code> selector with a
                    <code> Pagination</code> control in a table footer. <code>SortablePaginationTh</code>
                    {" "}turns a header cell into a sort toggle, and <code>MiniPagination</code> is a compact
                    variant for small tables.
                </p>
            </Section>

            <SectionTable header="Paginated, sortable table" striped hover headerSize={4}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <SortablePaginationTh
                            sortDirection={sortDirection} sortField={sortField} field="c" onSort={(field) => { setSortField(field); setSortDirection(changeSortDirection(sortDirection)) }}
                            numberOfPages={numberOfPages} onChange={(_, newPage) => setPageNumber(newPage)} pageNumber={pageNumber}>Header 3</SortablePaginationTh>
                    </tr>
                </thead>
                <tbody>
                    {tableData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).map((row) => (
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
                                <Pagination numberOfPages={numberOfPages} onChange={(_, newPage) => setPageNumber(newPage)} pageNumber={pageNumber} />
                            </PaginationControls>
                        </td>
                    </tr>
                </tfoot>
            </SectionTable>

            <Section title="Mini Pagination" header="Mini Pagination" headerSize={4}>
                <p>A compact pager for small, embedded tables.</p>
                <SectionTable striped hover headerSize={4}>
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
