import { Page } from "@andrewmclachlan/moo-app";
import { Section, NavItemDivider, IconButton, SectionTable, EditColumn, ComboBox, Button, Modal, ButtonGroup, Badge, CloseBadge, Alert, Nav, Tabs, Tab, Collapsible } from "@andrewmclachlan/moo-ds";
import { Tags } from "@andrewmclachlan/moo-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const Components = () => {

    const [tableValue, setTableValue] = useState<string | undefined>("Row 1 Data 1");
    const [tableNumValue, setTableNumValue] = useState<number | undefined>(1);
    const [showModal, setShowModal] = useState(false);

    const [showWarning, setShowWarning] = useState(true);

    return (
        <Page title="Components" breadcrumbs={[{ route: "/components", text: "Components" }]} navItems={[{ route: "/components/icon-link-button", image: <Tags />, text: "Icon Link Button" }, { route: "/components/icon-button", image: <Tags />, text: "Icon Button" }, <NavItemDivider />,
        { route: "/components/tag-panel", image: <Tags />, text: "Tag Panel" }]} actions={[<IconButton icon={faPlus} key="create">Create</IconButton>]}>
            <Section className="buttons" title="Buttons">
                <Button size="sm" variant="link">Sample</Button>
                <Button>Sample 2</Button>
                <Button variant="outline-primary">Sample 3</Button>
                <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Test Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>This is a test modal launched from the Components page.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button onClick={() => setShowModal(false)}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </Section>

            <Section title="Button Groups" header="Button Groups" headerSize={4}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <ButtonGroup>
                        <Button>Save</Button>
                        <Button variant="secondary">Draft</Button>
                        <Button variant="danger">Cancel</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button size="sm" variant="outline-primary">Day</Button>
                        <Button size="sm" variant="outline-primary">Week</Button>
                        <Button size="sm" variant="outline-primary">Month</Button>
                        <Button size="sm" variant="outline-primary">Year</Button>
                    </ButtonGroup>
                </div>
            </Section>

            <Section title="Badges" header="Badges" headerSize={4}>
                <h5>Semantic — solid</h5>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge bg="primary">Primary</Badge>
                    <Badge bg="secondary">Secondary</Badge>
                    <Badge bg="success">Success</Badge>
                    <Badge bg="danger">Danger</Badge>
                    <Badge bg="warning">Warning</Badge>
                    <Badge bg="info">Info</Badge>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge pill bg="primary">Primary</Badge>
                    <Badge pill bg="secondary">Secondary</Badge>
                    <Badge pill bg="success">Success</Badge>
                    <Badge pill bg="danger">Danger</Badge>
                    <Badge pill bg="warning">Warning</Badge>
                    <Badge pill bg="info">Info</Badge>
                </div>
                <h5>Hues — solid</h5>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge bg="blue">Blue</Badge>
                    <Badge bg="indigo">Indigo</Badge>
                    <Badge bg="purple">Purple</Badge>
                    <Badge bg="pink">Pink</Badge>
                    <Badge bg="rose">Rose</Badge>
                    <Badge bg="orange">Orange</Badge>
                    <Badge bg="amber">Amber</Badge>
                    <Badge bg="yellow">Yellow</Badge>
                    <Badge bg="green">Green</Badge>
                    <Badge bg="emerald">Emerald</Badge>
                    <Badge bg="teal">Teal</Badge>
                    <Badge bg="cyan">Cyan</Badge>
                    <Badge bg="slate">Slate</Badge>
                    <Badge bg="neutral">Neutral</Badge>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge pill bg="blue">Blue</Badge>
                    <Badge pill bg="indigo">Indigo</Badge>
                    <Badge pill bg="purple">Purple</Badge>
                    <Badge pill bg="pink">Pink</Badge>
                    <Badge pill bg="rose">Rose</Badge>
                    <Badge pill bg="orange">Orange</Badge>
                    <Badge pill bg="amber">Amber</Badge>
                    <Badge pill bg="yellow">Yellow</Badge>
                    <Badge pill bg="green">Green</Badge>
                    <Badge pill bg="emerald">Emerald</Badge>
                    <Badge pill bg="teal">Teal</Badge>
                    <Badge pill bg="cyan">Cyan</Badge>
                    <Badge pill bg="slate">Slate</Badge>
                    <Badge pill bg="neutral">Neutral</Badge>
                </div>
                <h5>Hues — muted</h5>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge bg="blue" muted>Blue</Badge>
                    <Badge bg="indigo" muted>Indigo</Badge>
                    <Badge bg="purple" muted>Purple</Badge>
                    <Badge bg="pink" muted>Pink</Badge>
                    <Badge bg="rose" muted>Rose</Badge>
                    <Badge bg="orange" muted>Orange</Badge>
                    <Badge bg="amber" muted>Amber</Badge>
                    <Badge bg="yellow" muted>Yellow</Badge>
                    <Badge bg="green" muted>Green</Badge>
                    <Badge bg="emerald" muted>Emerald</Badge>
                    <Badge bg="teal" muted>Teal</Badge>
                    <Badge bg="cyan" muted>Cyan</Badge>
                    <Badge bg="slate" muted>Slate</Badge>
                    <Badge bg="neutral" muted>Neutral</Badge>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge pill bg="blue" muted>Blue</Badge>
                    <Badge pill bg="indigo" muted>Indigo</Badge>
                    <Badge pill bg="purple" muted>Purple</Badge>
                    <Badge pill bg="pink" muted>Pink</Badge>
                    <Badge pill bg="rose" muted>Rose</Badge>
                    <Badge pill bg="orange" muted>Orange</Badge>
                    <Badge pill bg="amber" muted>Amber</Badge>
                    <Badge pill bg="yellow" muted>Yellow</Badge>
                    <Badge pill bg="green" muted>Green</Badge>
                    <Badge pill bg="emerald" muted>Emerald</Badge>
                    <Badge pill bg="teal" muted>Teal</Badge>
                    <Badge pill bg="cyan" muted>Cyan</Badge>
                    <Badge pill bg="slate" muted>Slate</Badge>
                    <Badge pill bg="neutral" muted>Neutral</Badge>
                </div>
                <h5>Hues — outline</h5>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge bg="blue" outline>Blue</Badge>
                    <Badge bg="indigo" outline>Indigo</Badge>
                    <Badge bg="purple" outline>Purple</Badge>
                    <Badge bg="pink" outline>Pink</Badge>
                    <Badge bg="rose" outline>Rose</Badge>
                    <Badge bg="orange" outline>Orange</Badge>
                    <Badge bg="amber" outline>Amber</Badge>
                    <Badge bg="yellow" outline>Yellow</Badge>
                    <Badge bg="green" outline>Green</Badge>
                    <Badge bg="emerald" outline>Emerald</Badge>
                    <Badge bg="teal" outline>Teal</Badge>
                    <Badge bg="cyan" outline>Cyan</Badge>
                    <Badge bg="slate" outline>Slate</Badge>
                    <Badge bg="neutral" outline>Neutral</Badge>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge pill bg="blue" outline>Blue</Badge>
                    <Badge pill bg="indigo" outline>Indigo</Badge>
                    <Badge pill bg="purple" outline>Purple</Badge>
                    <Badge pill bg="pink" outline>Pink</Badge>
                    <Badge pill bg="rose" outline>Rose</Badge>
                    <Badge pill bg="orange" outline>Orange</Badge>
                    <Badge pill bg="amber" outline>Amber</Badge>
                    <Badge pill bg="yellow" outline>Yellow</Badge>
                    <Badge pill bg="green" outline>Green</Badge>
                    <Badge pill bg="emerald" outline>Emerald</Badge>
                    <Badge pill bg="teal" outline>Teal</Badge>
                    <Badge pill bg="cyan" outline>Cyan</Badge>
                    <Badge pill bg="slate" outline>Slate</Badge>
                    <Badge pill bg="neutral" outline>Neutral</Badge>
                </div>
                <h5>Pills</h5>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge bg="primary" pill>Primary</Badge>
                    <Badge bg="indigo" pill muted>Indigo muted</Badge>
                    <Badge bg="teal" pill outline>Teal outline</Badge>
                    <Badge bg="rose" pill>Rose</Badge>
                </div>
                <h5>Custom colour</h5>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge colour="#7c6cff">Hex</Badge>
                    <Badge colour="rgb(255, 99, 132)">RGB</Badge>
                    <Badge colour="hsl(160, 70%, 45%)">HSL</Badge>
                    <Badge colour="var(--primary)">CSS var</Badge>
                    <Badge colour="#fde68a" textColour="#78350f">Light bg / dark text</Badge>
                    <Badge colour="#7c6cff" muted>Custom muted</Badge>
                    <Badge colour="#7c6cff" outline>Custom outline</Badge>
                </div>
                <h5>With icon</h5>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Badge bg="primary" icon={<FontAwesomeIcon icon="star" />}>Featured</Badge>
                    <Badge bg="success" icon={<FontAwesomeIcon icon="check" />}>Done</Badge>
                    <Badge bg="danger" icon={<FontAwesomeIcon icon="circle-xmark" />}>Failed</Badge>
                    <Badge bg="warning" icon={<FontAwesomeIcon icon="triangle-exclamation" />}>Warning</Badge>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Badge bg="indigo" muted icon={<FontAwesomeIcon icon="bolt" />}>Muted</Badge>
                    <Badge bg="teal" outline icon={<FontAwesomeIcon icon="leaf" />}>Outline</Badge>
                    <Badge bg="rose" pill icon={<FontAwesomeIcon icon="heart" />}>Pill</Badge>
                    <Badge colour="#7c6cff" muted icon={<FontAwesomeIcon icon="bolt" />}>Custom + muted</Badge>
                </div>
            </Section>

            <Section title="Close Badges" header="Close Badges" headerSize={4}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <CloseBadge bg="primary" onClose={() => alert("Removed: React")}>React</CloseBadge>
                    <CloseBadge bg="success" onClose={() => alert("Removed: TypeScript")}>TypeScript</CloseBadge>
                    <CloseBadge bg="info" onClose={() => alert("Removed: Vite")}>Vite</CloseBadge>
                    <CloseBadge bg="warning" onClose={() => alert("Removed: Node.js")}>Node.js</CloseBadge>
                </div>
            </Section>

            <Section title="Alerts" header="Alerts" headerSize={4}>
                <Alert variant="success">
                    <Alert.Heading>Success!</Alert.Heading>
                    Your changes have been saved successfully.
                </Alert>
                <Alert variant="info">
                    This is an informational alert for general notices.
                </Alert>
                <Alert variant="warning" dismissible show={showWarning} onClose={() => setShowWarning(false)}>
                    This is a dismissible warning alert. Click the close button to dismiss.
                </Alert>
                <Alert variant="danger">
                    An error occurred while processing your request.
                </Alert>
                {!showWarning && (
                    <Button size="sm" variant="warning" onClick={() => setShowWarning(true)}>Show Warning Again</Button>
                )}
            </Section>

            <Section title="Tabs" header="Tabs" headerSize={4}>
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

            <Section title="Nav Pills" header="Nav - Pills" headerSize={4}>
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

            <Collapsible header="Advanced Options">
                <p>These are advanced settings that are hidden by default.</p>
                <ul>
                    <li>Enable debug mode</li>
                    <li>Show verbose logging</li>
                    <li>Use experimental features</li>
                </ul>
            </Collapsible>

            <SectionTable header="Table" striped hover headerSize={2}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <EditColumn value={tableValue} onChange={e => setTableValue(e?.value)} />
                        <EditColumn type="number" value={tableNumValue ?? ""} onChange={e => setTableNumValue(Number.isNaN(e?.valueAsNumber) ? undefined : e?.valueAsNumber)} />
                        <td>Row 1 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 2 Data 1</td>
                        <td>Row 2 Data 2</td>
                        <td>Row 2 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 3 Data 1</td>
                        <td>Row 3 Data 2</td>
                        <td>Row 3 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 4 Data 1</td>
                        <td>Row 4 Data 2</td>
                        <td>Row 4 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 5 Data 1</td>
                        <td>Row 5 Data 2</td>
                        <td>Row 5 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 6 Data 1</td>
                        <td>Row 6 Data 2</td>
                        <td>Row 6 Data 3</td>
                    </tr>
                </tbody>
                <tfoot
                >
                    <tr>
                        <td>Footer 1</td>
                        <td>Footer 2</td>
                        <td>Footer 3</td>
                    </tr>
                </tfoot>
            </SectionTable>


            <SectionTable striped hover headerSize={2}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Row 1 Data 1</td>
                        <td>Row 1 Data 2</td>
                        <td>Row 1 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 2 Data 1</td>
                        <td>Row 2 Data 2</td>
                        <td>Row 2 Data 3</td>
                    </tr>
                </tbody>
                <tfoot
                >
                    <tr>
                        <td>Footer 1</td>
                        <td>Footer 2</td>
                        <td>Footer 3</td>
                    </tr>
                </tfoot>
            </SectionTable>

            <SectionTable header="Table" hover headerSize={2}>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="group-row">
                        <td colSpan={3}>Group 1</td>
                    </tr>
                    <tr>
                        <EditColumn value={tableValue} onChange={e => setTableValue(e?.value)} />
                        <EditColumn type="number" value={tableNumValue ?? ""} onChange={e => setTableNumValue(Number.isNaN(e?.valueAsNumber) ? undefined : e?.valueAsNumber)} />
                        <td>Row 1 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 2 Data 1</td>
                        <td>Row 2 Data 2</td>
                        <td>Row 2 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 3 Data 1</td>
                        <td>Row 3 Data 2</td>
                        <td>Row 3 Data 3</td>
                    </tr>
                    <tr className="group-row">
                        <td colSpan={3}>Group 2</td>
                    </tr>
                    <tr>
                        <td>Row 4 Data 1</td>
                        <td>Row 4 Data 2</td>
                        <td>Row 4 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 5 Data 1</td>
                        <td>Row 5 Data 2</td>
                        <td>Row 5 Data 3</td>
                    </tr>
                    <tr>
                        <td>Row 6 Data 1</td>
                        <td>Row 6 Data 2</td>
                        <td>Row 6 Data 3</td>
                    </tr>
                </tbody>
                <tfoot
                >
                    <tr>
                        <td>Footer 1</td>
                        <td>Footer 2</td>
                        <td>Footer 3</td>
                    </tr>
                </tfoot>
            </SectionTable>
        </Page>
    );
}
