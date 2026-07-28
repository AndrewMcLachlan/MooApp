import { Page } from "@andrewmclachlan/moo-app";
import { Section, SectionTable, Collapsible, Widget, Row, Badge } from "@andrewmclachlan/moo-ds";
import { layoutNav } from "../../nav";

export const PageSections = () => {

    return (
        <Page title="Page & Sections" breadcrumbs={[{ route: "/layout/page-sections", text: "Layout" }, { route: "/layout/page-sections", text: "Page & Sections" }]} navItems={layoutNav}>

            <Section title="Page" header="Page" headerSize={3}>
                <p>
                    <code>Page</code> is the outer wrapper for a route. It sets the document title,
                    publishes the breadcrumbs you see in the header, and can push a secondary nav and
                    header actions into the shell. Every showcase page here is a <code>Page</code>;
                    the breadcrumb trail above and the category nav in the sidebar come from it.
                </p>
            </Section>

            <Section title="Section" header="Section" headerSize={4}>
                <p>
                    <code>Section</code> is the standard content block: an optional header and a body
                    with consistent spacing. <code>headerSize</code> picks the heading level so a page
                    reads as a proper document outline.
                </p>
            </Section>

            <Section title="Section header sizes" header="Header sizes" headerSize={4}>
                <Section header="headerSize 3" headerSize={3}><p>A top-level block.</p></Section>
                <Section header="headerSize 4" headerSize={4}><p>A nested block.</p></Section>
                <Section header="headerSize 5" headerSize={5}><p>A small sub-block.</p></Section>
            </Section>

            <SectionTable header="SectionTable" headerSize={4} striped hover>
                <thead>
                    <tr><th>Component</th><th>Purpose</th></tr>
                </thead>
                <tbody>
                    <tr><td>Section</td><td>Content block with a header</td></tr>
                    <tr><td>SectionTable</td><td>A Section wrapping a table</td></tr>
                    <tr><td>Widget</td><td>Dashboard card</td></tr>
                </tbody>
            </SectionTable>

            <Section title="Widgets" header="Widget & Row" headerSize={4}>
                <p>
                    <code>Widget</code> is a dashboard card; drop several into a <code>Row</code> and
                    they lay out as a responsive grid. See the Home page for the live dashboard.
                </p>
                <Row>
                    <Widget header="Sessions" size="single" headerSize={5}>
                        <p className="stat">342</p>
                        <Badge bg="info">Live</Badge>
                    </Widget>
                    <Widget header="Errors" size="single" headerSize={5}>
                        <p className="stat">3</p>
                        <Badge bg="danger">-1</Badge>
                    </Widget>
                </Row>
            </Section>

            <Section title="Collapsible" header="Collapsible" headerSize={4}>
                <p>A header that expands and collapses its body. Useful for secondary detail.</p>
                <Collapsible header="Show details">
                    <p>Hidden until expanded &mdash; good for advanced options or long explanations.</p>
                </Collapsible>
            </Section>

        </Page>
    );
}
