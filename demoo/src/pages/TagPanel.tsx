import { Page, TagPanel as TagPanelComponent } from "@andrewmclachlan/mooapp";
import { useMemo, useState } from "react";

export const TagPanel = () => {

    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const items = useMemo(() => {
        const items = [];
        for (let i = 0; i < 10; i++) {
            items.push({ id: i, text: `Item ${i}` });
        }
        return items;
    }, []);

    return (
        <Page title="Tag Panel">
            <TagPanelComponent items={items} labelField={i => i.text} valueField={i => i.id.toString()} selectedItems={selectedItems} onAdd={i => setSelectedItems([...selectedItems, i])} onRemove={i => setSelectedItems(selectedItems.filter((i2) => i2.id !== i.id))} alwaysShowEditPanel />
        </Page>
    );
}
