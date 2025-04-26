import { Section, useHttpClient, Page, NavItemDivider, IconButton, SectionTable, EditColumn, Pagination, PageSize, PaginationControls, SortablePaginationTh, changeSortDirection, SortDirection } from "@andrewmclachlan/mooapp";
import { Button } from "react-bootstrap";
import { Tags } from "../assets";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const tableData = Array.from({ length: 100 }, (_, i) => ({ a: `Row ${i + 1} Data 1`, b: `Row ${i + 1} Data 2`, c: `Row ${i + 1} Data 3` }));

export const Table = () => {

    const [tableValue, setTableValue] = useState<string | undefined>("Row 1 Data 1");
    const [tableNumValue, setTableNumValue] = useState<number | undefined>(1);

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortField, setSortField] = useState<string>("a");
    const [sortDirection, setSortDirection] = useState<SortDirection>("Ascending");


    const numberOfPages = Math.ceil(tableData.length / pageSize);

    return (
        <Page title="Components" breadcrumbs={[{ route: "/components", text: "Components" }]} navItems={[{ route: "/components/iconlinkbutton", image: <Tags />, text: "Icon Link Button" }, { route: "/components/iconbutton", image: <Tags />, text: "Icon Button" }, <NavItemDivider />,
        { route: "/components/tag-panel", image: <Tags />, text: "Tag Panel" }]} actions={[<IconButton icon={faPlus}>Create</IconButton>]}>
            <Section title="Components">
                <Button size="sm" variant="link">Sample</Button>
                <Button>Sample 2</Button>
                <Button variant="outline-primary">Sample 3</Button>
            </Section>

            <SectionTable header="Table" striped hover headerSize={2}>
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
        </Page>
    );
}
