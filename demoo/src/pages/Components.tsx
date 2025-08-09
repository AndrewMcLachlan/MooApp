import { Page } from "@andrewmclachlan/moo-app";
import { Section, NavItemDivider, IconButton, SectionTable, EditColumn, ComboBox } from "@andrewmclachlan/moo-ds";
import { Button } from "react-bootstrap";
import { Tags } from "../assets";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const Components = () => {

    const [tableValue, setTableValue] = useState<string | undefined>("Row 1 Data 1");
    const [tableNumValue, setTableNumValue] = useState<number | undefined>(1);

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
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <EditColumn value={tableValue} onChange={e => setTableValue(e?.value)} />
                        <EditColumn type="number" value={tableNumValue ?? ""} onChange={e => setTableNumValue(Number.isNaN(e?.valueAsNumber) ? undefined : e?.valueAsNumber)} />
                        <td>Row 1 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 2 Data 1</td>
                        <td>Row 2 Data 2</td>
                        <td>Row 2 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 3 Data 1</td>
                        <td>Row 3 Data 2</td>
                        <td>Row 3 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 4 Data 1</td>
                        <td>Row 4 Data 2</td>
                        <td>Row 4 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 5 Data 1</td>
                        <td>Row 5 Data 2</td>
                        <td>Row 5 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 6 Data 1</td>
                        <td>Row 6 Data 2</td>
                        <td>Row 6 Data 3</td>
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


            <SectionTable striped hover headerSize={2}>
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

            <SectionTable header="Table" hover headerSize={2}>
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
                    <tr>
                        <EditColumn value={tableValue} onChange={e => setTableValue(e?.value)} />
                        <EditColumn type="number" value={tableNumValue ?? ""} onChange={e => setTableNumValue(Number.isNaN(e?.valueAsNumber) ? undefined : e?.valueAsNumber)} />
                        <td>Row 1 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 2 Data 1</td>
                        <td>Row 2 Data 2</td>
                        <td>Row 2 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 3 Data 1</td>
                        <td>Row 3 Data 2</td>
                        <td>Row 3 Data 3</td>
                    </tr>
                    <tr className="group-row">
                        <td colSpan={3}>Group 2</td>
                    </tr>
                    <tr>
                        <td>Row 4 Data 1</td>
                        <td>Row 4 Data 2</td>
                        <td>Row 4 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 5 Data 1</td>
                        <td>Row 5 Data 2</td>
                        <td>Row 5 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 6 Data 1</td>
                        <td>Row 6 Data 2</td>
                        <td><ComboBox labelField={a => a} valueField={a => a} items={[1, 2, 3]} tabIndex={10} multiSelect /></td>
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
