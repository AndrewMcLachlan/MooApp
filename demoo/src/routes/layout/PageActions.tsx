import { Page, type PageAction } from "@andrewmclachlan/moo-app";
import { Section } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { layoutNav } from "../../nav";

export const PageActions = () => {

    const [showNet, setShowNet] = useState(true);
    const [compact, setCompact] = useState(false);
    const [lastCommand, setLastCommand] = useState<string>("none yet");

    const actions: PageAction[] = [
        { id: "show-net", label: "Show net amount", checked: showNet, onClick: () => setShowNet(!showNet) },
        { id: "compact", label: "Compact", checked: compact, onClick: () => setCompact(!compact) },
        { id: "import", label: "Import", icon: "upload", group: "write", onClick: () => setLastCommand("Import") },
        { id: "add", label: "Add profile", group: "write", to: "/profile" },
    ];

    return (
        <Page
            title="Page actions"
            breadcrumbs={[{ route: "/layout/page-sections", text: "Layout" }, { route: "/layout/page-actions", text: "Page actions" }]}
            navItems={layoutNav}
            actions={actions}
        >
            <Section title="Page actions" header="Page actions" headerSize={3}>
                <p>
                    A page describes its actions rather than rendering them, so each header can
                    present them in the form that fits. Widen and narrow the window to see it: above
                    992px they are a row of controls in the second header band; below, they collapse
                    into the <code>⋮</code> menu on the single mobile bar.
                </p>
                <p>
                    An action with <code>checked</code> is a toggle &mdash; a switch on desktop, a
                    ticked item in the menu. One with <code>to</code> stays an anchor, so it keeps
                    middle-click and open-in-new-tab. <code>group: "write"</code> sorts an action
                    below the menu&rsquo;s separator, away from the reading toggles.
                </p>
            </Section>

            <Section title="State" header="Current state" headerSize={4}>
                <dl>
                    <dt>Show net amount</dt>
                    <dd>{showNet ? "on" : "off"}</dd>
                    <dt>Compact</dt>
                    <dd>{compact ? "on" : "off"}</dd>
                    <dt>Last command</dt>
                    <dd>{lastCommand}</dd>
                </dl>
            </Section>

            <Section title="customActions" header="customActions" headerSize={4}>
                <p>
                    Anything that is neither a command nor a link &mdash; a search field, a segmented
                    selector &mdash; goes in <code>customActions</code>, which still takes nodes and
                    renders them inline in both headers. It is a separate prop precisely so it reads
                    as the exception.
                </p>
            </Section>
        </Page>
    );
};
