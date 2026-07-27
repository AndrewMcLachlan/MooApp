import { Page } from "@andrewmclachlan/moo-app";
import { Section, Breadcrumb, Nav, Tabs, Tab } from "@andrewmclachlan/moo-ds";
import { layoutNav } from "../../nav";

export const Navigation = () => {

    return (
        <Page title="Navigation" breadcrumbs={[{ route: "/layout/page-sections", text: "Layout" }, { route: "/layout/navigation", text: "Navigation" }]} navItems={layoutNav}>

            <Section title="Breadcrumb" header="Breadcrumb" headerSize={4}>
                <p>
                    A trail back up the hierarchy. The shell renders one automatically from each
                    <code> Page</code>&rsquo;s <code>breadcrumbs</code> prop (see the header above); it
                    can also be used directly.
                </p>
                <Breadcrumb breadcrumbs={[{ route: "/layout/page-sections", text: "Layout" }, { route: "/layout/navigation", text: "Navigation" }]} />
            </Section>

            <Section title="Tabs" header="Tabs" headerSize={4}>
                <p>In-page tabbed panels for splitting related content without a route change.</p>
                <Tabs defaultActiveKey="tab1">
                    <Tab eventKey="tab1" title="Overview">
                        <p>This is the Overview panel content.</p>
                    </Tab>
                    <Tab eventKey="tab2" title="Details">
                        <p>This is the Details panel with more information.</p>
                    </Tab>
                    <Tab eventKey="tab3" title="Settings">
                        <p>Settings panel where you can configure options.</p>
                    </Tab>
                    <Tab eventKey="tab4" title="Disabled" disabled>
                        <p>This should not be visible.</p>
                    </Tab>
                </Tabs>
            </Section>

            <Section title="Nav Pills" header="Nav &mdash; pills" headerSize={4}>
                <p>A lightweight pill switcher for filtering a view in place.</p>
                <Nav variant="pills">
                    <Nav.Item>
                        <Nav.Link active>All</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link>Active</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link>Archived</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Section>

        </Page>
    );
}
