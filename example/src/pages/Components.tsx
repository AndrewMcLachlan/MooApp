import { Section, useHttpClient, Page, NavItemDivider, IconButton, SectionTable } from "@andrewmclachlan/mooapp";
import { Button, Table } from "react-bootstrap";
import { Tags } from "../assets";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const Components = () => {

    const httpClient = useHttpClient();
    httpClient.get("fake").then(() => console.debug("Success")).catch((e) => console.debug(e));
    return (
        <Page title="Components" breadcrumbs={[{ route: "/", text: "Components" }]} navItems={[{ route: "/components/subcomponents", image: <Tags />, text: "Sub-Components" }, <NavItemDivider />]} actions={[<IconButton icon={faPlus}>Create</IconButton>]}>
            <Section title="Components">
                <Button size="sm" variant="link">Sample</Button>
                <Button>Sample 2</Button>
            </Section>

            <SectionTable title="Table" striped hover titleSize={2}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Row 1 Data 1</td>
                        <td>Row 1 Data 2</td>
                        <td>Row 1 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 2 Data 1</td>
                        <td>Row 2 Data 2</td>
                        <td>Row 2 Data 3</td>
                    </tr>
                </tbody>
                <tfoot
                >
                    <tr>
                        <td>Footer 1</td>
                        <td>Footer 2</td>
                        <td>Footer 3</td>
                    </tr>
                </tfoot>
            </SectionTable>

            
            <SectionTable className="section" striped hover titleSize={2}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Row 1 Data 1</td>
                        <td>Row 1 Data 2</td>
                        <td>Row 1 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 2 Data 1</td>
                        <td>Row 2 Data 2</td>
                        <td>Row 2 Data 3</td>
                    </tr>
                </tbody>
                <tfoot
                >
                    <tr>
                        <td>Footer 1</td>
                        <td>Footer 2</td>
                        <td>Footer 3</td>
                    </tr>
                </tfoot>
            </SectionTable>
        </Page>
    );
}