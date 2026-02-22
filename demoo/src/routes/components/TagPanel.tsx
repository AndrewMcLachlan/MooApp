import { Page } from "@andrewmclachlan/moo-app";
import { ComboBox, TagPanel as TagPanelComponent } from "@andrewmclachlan/moo-ds";
import { useMemo, useState } from "react";

type item = { id: number, text: string, colour: string };

export const TagPanel = () => {

    const [selectedItems, setSelectedItems] = useState<item[]>([]);

    const items = useMemo(() => {
        const items: item[] = [];
        for (let i = 0; i < 10; i++) {
            items.push({ 
                id: i, 
                text: `Item ${i}`, 
                colour: `#${(i*10).toString(16).padStart(2, '0').repeat(3)}` 
            });
        }
        return items;
    }, []);

    return (
        <Page title="Tag Panel">
            <TagPanelComponent<item> items={items} labelField={i => i.text} valueField={i => i.id} selectedItems={selectedItems} onChange={i => setSelectedItems(i)} alwaysShowEditPanel placeholder="Select Tag..." />
            <TagPanelComponent<item> items={items} labelField={i => i.text} valueField={i => i.id} colourField={i => i.colour} selectedItems={selectedItems} onChange={i => setSelectedItems(i)} placeholder="Select Tag..." />
            <TagPanelComponent<item> items={items} labelField={i => i.text} valueField={i => i.id} colourField={i => i.colour} selectedItems={selectedItems} onChange={i => setSelectedItems(i)} alwaysShowEditPanel placeholder="Select Tag..." creatable onCreate={(t) => alert("Tag: " + t)} />
            <ComboBox items={items} labelField={i => i.text} valueField={i => i.id} colourField={i => i.colour} selectedItems={selectedItems} onChange={i => setSelectedItems(i)} multiSelect clearable placeholder="Sel..." />
        </Page>
    );
}
