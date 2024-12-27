import { ComboBox, Page, TagPanel as TagPanelComponent } from "@andrewmclachlan/mooapp";
import { useMemo, useState } from "react";

type item = { id: number, text: string };

export const TagPanel = () => {

    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const items = useMemo(() => {
        const items: item[] = [];
        for (let i = 0; i < 10; i++) {
            items.push({ id: i, text: `Item ${i}` });
        }
        return items;
    }, []);

    return (
        <Page title="Tag Panel">
            <TagPanelComponent items={items} labelField={i => i.text} valueField={i => i.id.toString()} selectedItems={selectedItems} onChange={i => setSelectedItems(i)}  />
            <ComboBox items={items} labelField={i => i.text} valueField={i => i.id.toString()} selectedItems={selectedItems} onChange={i => setSelectedItems(i)} multiSelect clearable />
        </Page>
    );
}
