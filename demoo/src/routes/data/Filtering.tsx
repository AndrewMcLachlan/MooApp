import { Page } from "@andrewmclachlan/moo-app";
import { Drawer, FilterBar, FilterChip, Input, Section } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { dataNav } from "../../nav";

const allTags = ["Groceries", "Transport", "Subscriptions", "Utilities"];

export const Filtering = () => {

    const [tags, setTags] = useState<string[]>(["Groceries", "Transport", "Subscriptions"]);
    const [type, setType] = useState("");
    const [open, setOpen] = useState(false);

    const activeCount = tags.length + (type ? 1 : 0);

    return (
        <Page title="Filtering" breadcrumbs={[{ route: "/data/table", text: "Data" }, { route: "/data/filtering", text: "Filtering" }]} navItems={dataNav}>

            <Section title="FilterBar" header="FilterBar" headerSize={3}>
                <p>
                    A bar that keeps a filter&rsquo;s state on screen: one filter worth showing in
                    full, a <code>Filters</code> button badged with how many others are active, and a
                    chip per active filter. A filter you cannot see is one you forget you set.
                </p>

                <FilterBar
                    primary={<Input type="search" placeholder="Description contains..." />}
                    activeCount={activeCount}
                    onOpenFilters={() => setOpen(true)}
                    onClear={activeCount > 0 ? () => { setTags([]); setType(""); } : undefined}
                >
                    {tags.map(tag => (
                        <FilterChip key={tag} onRemove={() => setTags(tags.filter(t => t !== tag))}>{tag}</FilterChip>
                    ))}
                    {type && <FilterChip onRemove={() => setType("")}>{type}</FilterChip>}
                </FilterBar>
            </Section>

            <Section title="Sheet" header="Bottom drawer" headerSize={4}>
                <p>
                    On a phone the fields themselves belong in a sheet, so the bar stays a summary.
                    <code>Drawer</code> takes <code>placement=&quot;bottom&quot;</code> for this.
                </p>

                <Drawer show={open} onHide={() => setOpen(false)} placement="bottom" className="filter-sheet-demo">
                    <Drawer.Header closeButton><h2>Filters</h2></Drawer.Header>
                    <Drawer.Body>
                        <Input.Select aria-label="Type" value={type} onChange={e => setType(e.currentTarget.value)}>
                            <option value="">All</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </Input.Select>
                        {allTags.map(tag => (
                            <Input.Switch
                                key={tag}
                                id={`tag-${tag}`}
                                label={tag}
                                checked={tags.includes(tag)}
                                onChange={e => setTags(e.currentTarget.checked ? [...tags, tag] : tags.filter(t => t !== tag))}
                            />
                        ))}
                    </Drawer.Body>
                </Drawer>
            </Section>
        </Page>
    );
};
