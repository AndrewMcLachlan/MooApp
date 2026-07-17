import { Page } from "@andrewmclachlan/moo-app";
import { ComboBox, Section, SectionTable } from "@andrewmclachlan/moo-ds";
import { useMemo, useState } from "react";

type Tag = { id: number; text: string; colour: string };

const NAMES = [
    "Alcohol", "Aldi", "Amazon Prime", "Andy", "General Shopping", "Pharmacy",
    "Fuel", "Groceries", "Utilities", "Dining Out", "Subscriptions", "Transport",
    "Insurance", "Healthcare", "Entertainment", "Clothing", "Gifts", "Hardware",
];

export const ComboBoxPage = () => {

    const items = useMemo<Tag[]>(() => NAMES.map((text, id) => ({ id, text, colour: "#8b0000" })), []);

    const [many, setMany] = useState<Tag[]>(() => items.slice(0, 8));
    const [few, setFew] = useState<Tag[]>(() => items.slice(4, 6));
    const [inCell, setInCell] = useState<Tag[]>(() => items.slice(0, 7));

    const common = {
        items,
        labelField: (i: Tag) => i.text,
        valueField: (i: Tag) => i.id,
        colourField: (i: Tag) => i.colour,
        multiSelect: true,
        clearable: true,
        placeholder: "Select...",
    } as const;

    return (
        <Page title="ComboBox" breadcrumbs={[{ route: "/combo-box", text: "ComboBox" }]}>

            <Section title="Many selections" header="Many selections (collapse to one row)" headerSize={4}>
                <p>
                    While the dropdown is closed, the pills collapse to however many fit on a single
                    row plus a &ldquo;+N more&rdquo; chip. Click anywhere (except a remove &times;) to
                    open it &mdash; that expands to every pill and focuses the input. Resize the window
                    to see the fit re-measure.
                </p>
                <ComboBox {...common} selectedItems={many} onChange={setMany} />
            </Section>

            <Section title="Few selections" header="Few selections (all fit, no chip)" headerSize={4}>
                <ComboBox {...common} selectedItems={few} onChange={setFew} />
            </Section>

            <SectionTable header="In a table" headerSize={4} striped hover>
                <thead>
                    <tr>
                        <th className="column-25">Account</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Everyday</td>
                        <td><ComboBox {...common} selectedItems={inCell} onChange={setInCell} /></td>
                    </tr>
                    <tr>
                        <td>Savings</td>
                        <td><ComboBox {...common} selectedItems={few} onChange={setFew} /></td>
                    </tr>
                </tbody>
            </SectionTable>

        </Page>
    );
}
