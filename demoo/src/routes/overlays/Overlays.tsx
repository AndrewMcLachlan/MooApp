import { Page } from "@andrewmclachlan/moo-app";
import { Section, Button, Modal, Badge, Tooltip, OverlayTrigger, Popover } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

export const Overlays = () => {

    const [showModal, setShowModal] = useState(false);

    return (
        <Page title="Overlays" breadcrumbs={[{ route: "/overlays", text: "Overlays" }]}>

            <Section title="Modal" header="Modal" headerSize={4}>
                <p>A centred dialog over a dimmed backdrop, with a header, body and footer. It traps focus and closes on the backdrop, the close button or Escape.</p>
                <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm changes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>This is a modal dialog. Use it for focused tasks and confirmations that should block the rest of the page.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button onClick={() => setShowModal(false)}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </Section>

            <Section title="Tooltips" header="Tooltip" headerSize={4}>
                <p>The Tooltip component renders an info icon with a hover/focus tooltip. Text wraps within the tooltip&rsquo;s max-width.</p>

                <h5>Inline with text</h5>
                <div className="demo-row loose">
                    <span>Username <Tooltip id="username">The unique identifier for your account. Cannot be changed after creation.</Tooltip></span>
                    <span>API Rate Limit <Tooltip id="rate-limit">Maximum 1000 requests per minute. Contact support to increase your limit.</Tooltip></span>
                </div>

                <h5 className="demo-subhead">Short text</h5>
                <div className="demo-row loose">
                    <span>Status <Tooltip id="short">Active</Tooltip></span>
                    <span>Required <Tooltip id="required">This field is required.</Tooltip></span>
                </div>

                <h5 className="demo-subhead">Long wrapping text</h5>
                <div className="demo-row loose">
                    <span>Description <Tooltip id="long-wrap">Search for multiple terms by separating them with a comma. Results will include items matching any of the provided terms.</Tooltip></span>
                    <span>Permissions <Tooltip id="permissions">Users with the Administrator role have full access to all resources. Standard users can only view and edit their own content.</Tooltip></span>
                </div>
            </Section>

            <Section title="Popovers" header="OverlayTrigger + Popover" headerSize={4}>
                <p>OverlayTrigger wraps any element and shows a Popover on click, hover, or focus.</p>

                <h5>Trigger types</h5>
                <div className="demo-row">
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        rootClose
                        overlay={
                            <Popover id="click-popover">
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
                            <Popover id="hover-popover">
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
                        placement="bottom"
                        overlay={
                            <Popover id="focus-popover">
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

                <h5 className="demo-subhead">Placement</h5>
                <div className="demo-row center">
                    <OverlayTrigger trigger="click" placement="top" rootClose overlay={<Popover id="placement-top"><Popover.Body>Top placement</Popover.Body></Popover>}>
                        <Button variant="outline-secondary">Top</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger="click" placement="bottom" rootClose overlay={<Popover id="placement-bottom"><Popover.Body>Bottom placement</Popover.Body></Popover>}>
                        <Button variant="outline-secondary">Bottom</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger="click" placement="left" rootClose overlay={<Popover id="placement-left"><Popover.Body>Left placement</Popover.Body></Popover>}>
                        <Button variant="outline-secondary">Left</Button>
                    </OverlayTrigger>
                    <OverlayTrigger trigger="click" placement="right" rootClose overlay={<Popover id="placement-right"><Popover.Body>Right placement</Popover.Body></Popover>}>
                        <Button variant="outline-secondary">Right</Button>
                    </OverlayTrigger>
                </div>

                <h5 className="demo-subhead">Rich content</h5>
                <div className="demo-row">
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        rootClose
                        overlay={
                            <Popover id="rich-popover">
                                <Popover.Header>Server Status</Popover.Header>
                                <Popover.Body>
                                    <p><strong>Region:</strong> Australia East</p>
                                    <p><strong>CPU:</strong> 42%</p>
                                    <p><strong>Memory:</strong> 3.2 GB / 8 GB</p>
                                    <p><strong>Uptime:</strong> 14 days, 6 hours</p>
                                    <p><Badge bg="success">All systems operational</Badge></p>
                                </Popover.Body>
                            </Popover>
                        }
                    >
                        <Button variant="outline-primary">Server Details</Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        rootClose
                        overlay={<Popover id="body-only-popover"><Popover.Body>A simple popover with body content only and no header.</Popover.Body></Popover>}
                    >
                        <Button variant="outline-secondary">Body Only</Button>
                    </OverlayTrigger>
                </div>
            </Section>

        </Page>
    );
}
