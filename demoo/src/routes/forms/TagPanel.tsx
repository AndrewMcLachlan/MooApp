import { Page } from "@andrewmclachlan/moo-app";
import { Section, TagPanel as TagPanelComponent } from "@andrewmclachlan/moo-ds";
import { useMemo, useState } from "react";
import { formsNav } from "../../nav";

type Item = { id: number, text: string, colour: string };

export const TagPanelPage = () => {

    const [selectedItems, setSelectedItems] = useState<Item[]>([]);

    const items = useMemo<Item[]>(() => {
        const result: Item[] = [];
        for (let i = 0; i < 10; i++) {
            result.push({
                id: i,
                text: `Item ${i}`,
                colour: `#${(i * 10).toString(16).padStart(2, "0").repeat(3)}`,
            });
        }
        return result;
    }, []);

    const common = {
        items,
        labelField: (i: Item) => i.text,
        valueField: (i: Item) => i.id,
        selectedItems,
        onChange: setSelectedItems,
        placeholder: "Select Tag...",
    } as const;

    return (
        <Page title="Tag Panel" breadcrumbs={[{ route: "/forms/form", text: "Forms" }, { route: "/forms/tag-panel", text: "Tag Panel" }]} navItems={formsNav}>

            <Section title="Always editable" header="Always-editable panel" headerSize={4}>
                <p><code>alwaysShowEditPanel</code> keeps the edit affordance visible instead of hiding it until focus.</p>
                <TagPanelComponent<Item> {...common} alwaysShowEditPanel />
            </Section>

            <Section title="Coloured tags" header="Coloured tags" headerSize={4}>
                <p>Provide a <code>colourField</code> and each pill takes its tag&rsquo;s colour.</p>
                <TagPanelComponent<Item> {...common} colourField={(i) => i.colour} />
            </Section>

            <Section title="Creatable" header="Creatable" headerSize={4}>
                <p>With <code>creatable</code>, typing a new value offers to add it via <code>onCreate</code>.</p>
                <TagPanelComponent<Item> {...common} colourField={(i) => i.colour} alwaysShowEditPanel creatable onCreate={(t) => console.log("Create tag:", t)} />
            </Section>

        </Page>
    );
}
