import { Page } from "@andrewmclachlan/moo-app";
import { Section, Button, Drawer } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { layoutNav } from "../../nav";

export const DrawerPage = () => {

    const [showLeftDrawer, setShowLeftDrawer] = useState(false);
    const [showRightDrawer, setShowRightDrawer] = useState(false);
    const [showRival, setShowRival] = useState(false);

    return (
        <Page title="Drawer" breadcrumbs={[{ route: "/layout/page-sections", text: "Layout" }, { route: "/layout/drawer", text: "Drawer" }]} navItems={layoutNav}>

            <Section title="Drawer" header="Drawer" headerSize={4}>
                <p>
                    A panel that slides in from the edge of the screen for filters, detail views or
                    secondary forms. <code>placement</code> chooses the side; it dims the page behind
                    it and closes on the backdrop or the close button.
                </p>
                <div className="demo-row">
                    <Button onClick={() => setShowLeftDrawer(true)}>Open Left Drawer</Button>
                    <Button variant="secondary" onClick={() => setShowRightDrawer(true)}>Open Right Drawer</Button>
                </div>

                <Drawer show={showLeftDrawer} onHide={() => setShowLeftDrawer(false)} placement="start">
                    <Drawer.Header closeButton>
                        <h5>Filters</h5>
                    </Drawer.Header>
                    <Drawer.Body>
                        <p>Apply filters to narrow down results:</p>
                        <ul>
                            <li>Category: All</li>
                            <li>Status: Active</li>
                            <li>Date: Last 30 days</li>
                        </ul>
                        <Button onClick={() => setShowLeftDrawer(false)}>Apply</Button>
                    </Drawer.Body>
                </Drawer>

                <Drawer show={showRightDrawer} onHide={() => setShowRightDrawer(false)} placement="end">
                    <Drawer.Header closeButton>
                        <h5>Item Details</h5>
                    </Drawer.Header>
                    <Drawer.Body>
                        <p><strong>Name:</strong> Sample Item</p>
                        <p><strong>Created:</strong> 2026-01-15</p>
                        <p><strong>Status:</strong> Active</p>
                        <p><strong>Description:</strong> This is a detailed view of the selected item shown in a right-side drawer.</p>
                    </Drawer.Body>
                </Drawer>
            </Section>

            <Section title="Stacking" header="Above everything else" headerSize={4}>
                <p>
                    The panel and its dimming both render in the browser&rsquo;s top layer, so page
                    content cannot cover them. Show the panel below &mdash; it sits at the highest
                    <code> z-index</code> a page can use &mdash; then open a drawer. The drawer still
                    paints over it; the fallback <code>z-index</code> of 1045 would lose.
                </p>
                <div className="demo-row">
                    <Button variant="outline-primary" onClick={() => setShowRival(!showRival)}>
                        {showRival ? "Hide panel" : "Show panel"}
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setShowLeftDrawer(true)}>Open Left Drawer</Button>
                </div>
                {showRival && <div className="stacking-rival">z-index: 2147483647</div>}
            </Section>

        </Page>
    );
}
