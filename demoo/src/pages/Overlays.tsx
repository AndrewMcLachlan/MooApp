import { Page } from "@andrewmclachlan/moo-app";
import { Section, Button, Drawer, Tooltip, OverlayTrigger, Popover } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

export const Overlays = () => {

    const [showLeftDrawer, setShowLeftDrawer] = useState(false);
    const [showRightDrawer, setShowRightDrawer] = useState(false);

    return (
        <Page title="Overlays" breadcrumbs={[{ route: "/overlays", text: "Overlays" }]}>
            <Section title="Drawers" header="Drawer" headerSize={4}>
                <div style={{ display: "flex", gap: "1rem" }}>
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

            <Section title="Tooltips" header="Tooltip" headerSize={4}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span>Username <Tooltip id="username">The unique identifier for your account. Cannot be changed after creation.</Tooltip></span>
                    <span>API Rate Limit <Tooltip id="rate-limit">Maximum 1000 requests per minute. Contact support to increase your limit.</Tooltip></span>
                </div>
            </Section>

            <Section title="Popovers" header="OverlayTrigger + Popover" headerSize={4}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        rootClose
                        overlay={
                            <Popover id="user-profile-popover">
                                <Popover.Header>User Profile</Popover.Header>
                                <Popover.Body>
                                    <p><strong>Jane Doe</strong></p>
                                    <p>jane.doe@example.com</p>
                                    <p>Role: Administrator</p>
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <Button variant="outline-primary">Click: User Card</Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                        trigger="hover"
                        placement="top"
                        overlay={
                            <Popover id="quick-stats-popover">
                                <Popover.Header>Quick Stats</Popover.Header>
                                <Popover.Body>
                                    <p>Users: 1,234</p>
                                    <p>Sessions: 342</p>
                                    <p>Uptime: 99.9%</p>
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <Button variant="outline-primary">Hover: Quick Stats</Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                        trigger="focus"
                        placement="right"
                        overlay={
                            <Popover id="help-popover">
                                <Popover.Header>Help</Popover.Header>
                                <Popover.Body>
                                    Focus this button to see contextual help text. This is useful for form field assistance.
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <Button variant="secondary">Focus: Help Text</Button>
                    </OverlayTrigger>
                </div>
            </Section>
        </Page>
    );
}
