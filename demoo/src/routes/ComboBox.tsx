import { Page } from "@andrewmclachlan/moo-app";
import { ComboBox, Section, SectionTable, TagPanel } from "@andrewmclachlan/moo-ds";
import { useMemo, useRef, useState } from "react";

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
    const [chromeless, setChromeless] = useState<Tag[]>(() => items.slice(2, 5));

    // "Include tags" pattern: the dropdown only suggests tags that already exist
    // (knownTags), and you type to include one that doesn't yet. Both start empty
    // -- there is nothing to select until a tag is created.
    const [knownTags, setKnownTags] = useState<Tag[]>([]);
    const [included, setIncluded] = useState<Tag[]>([]);
    const nextTagId = useRef(1000);

    const createTag = (name: string) => {
        const tag: Tag = { id: nextTagId.current++, text: name, colour: "#8b0000" };
        setKnownTags((prev) => [...prev, tag]); // now a suggestion for next time
        setIncluded((prev) => [...prev, tag]);  // and included straight away
    };

    const common = {
        items,
        labelField: (i: Tag) => i.text,
        valueField: (i: Tag) => i.id,
        colourField: (i: Tag) => i.colour,
        multiSelect: true,
        clearable: true,
        placeholder: "Select...",
        className: "cb-demo",
    } as const;

    return (
        <Page title="ComboBox" breadcrumbs={[{ route: "/combo-box", text: "ComboBox" }]}>

            <Section title="Many selections" header="Many selections (collapse to one row)" headerSize={4}>
                <p>
                    While the dropdown is closed, the pills collapse to however many fit on a single
                    row plus a &ldquo;+N more&rdquo; chip. Click that chip to expand every pill in
                    place (it becomes &ldquo;show less&rdquo;); resize the window to see the fit
                    re-measure. Open the dropdown and the selected items stay in the list &mdash;
                    checked and pinned to the top &mdash; so you can see and untick any of them,
                    including the ones hidden behind &ldquo;+N more&rdquo;.
                </p>
                <ComboBox {...common} selectedItems={many} onChange={setMany} />
            </Section>

            <Section title="Few selections" header="Few selections (all fit, no chip)" headerSize={4}>
                <ComboBox {...common} selectedItems={few} onChange={setFew} />
            </Section>

            <Section title="Creatable" header="Type to include, suggest from what exists (&ldquo;Include tags&hellip;&rdquo;)" headerSize={4}>
                <p>
                    The dropdown only suggests tags that already exist; you <em>type</em> to include
                    one that doesn&rsquo;t. Starting empty (no tags yet), clicking the control shows
                    <strong> no dropdown at all</strong> &mdash; there is nothing to select, and never
                    will be until a tag exists, so there is no empty bar. Start typing and an
                    &ldquo;Add &hellip;&rdquo; option appears; once added, the tag becomes a
                    suggestion the next time you open it.
                </p>
                <ComboBox
                    items={knownTags}
                    labelField={(i: Tag) => i.text}
                    valueField={(i: Tag) => i.id}
                    multiSelect
                    creatable
                    clearable
                    createLabel={(t: string) => `Add “${t}”`}
                    onCreate={createTag}
                    placeholder="Include tags..."
                    className="cb-demo"
                    selectedItems={included}
                    onChange={setIncluded}
                />
            </Section>

            <Section title="Chromeless" header="Chromeless until clicked (TagPanel)" headerSize={4}>
                <p>
                    <code>TagPanel</code> wraps the ComboBox and toggles its <code>readonly</code>{" "}
                    prop: while unfocused the chrome disappears &mdash; no border, background, or
                    controls, just the pills. Click anywhere on it to get the full editable
                    ComboBox back; click away (or press Enter/Tab) to collapse it again.
                </p>
                <TagPanel {...common} selectedItems={chromeless} onChange={setChromeless} />
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
