import { Page } from "@andrewmclachlan/moo-app";
import { Section, useMessages, Button, Widget, Badge, Spinner, Collapsible, Row } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

export const Home = () => {

    const messages = useMessages();
    const [widgetLoading, setWidgetLoading] = useState(false);

    const addAlert = () => {
        messages?.sendMessage({ key:"m1", message: "This is a test alert", variant: "danger" });
    }

    return (
        <Page title="Home">
            <Section title="Dashboard" header="Dashboard" headerSize={3}>
                <Button onClick={addAlert}>Show Alert</Button>
                <Button variant="outline-primary" onClick={() => setWidgetLoading(!widgetLoading)}>Toggle Widget Loading</Button>
            </Section>

            <Row>
                <Widget header="Total Users" size="single" headerSize={5}>
                    <p style={{ fontSize: "2rem", margin: 0 }}>1,234</p>
                    <Badge bg="success">+12%</Badge>
                </Widget>
                <Widget header="Revenue" size="single" headerSize={5}>
                    <p style={{ fontSize: "2rem", margin: 0 }}>$45,678</p>
                    <Badge bg="danger">-3%</Badge>
                </Widget>
                <Widget header="Active Sessions" size="single" headerSize={5} loading={widgetLoading}>
                    <p style={{ fontSize: "2rem", margin: 0 }}>342</p>
                    <Badge bg="info">Live</Badge>
                </Widget>
                <Widget header="View Reports" size="single" headerSize={5} to="/table">
                    <p style={{ fontSize: "2rem", margin: 0 }}>28</p>
                    <Badge bg="warning">Pending</Badge>
                </Widget>
            </Row>

            <Section title="Spinners" header="Spinner Variants" headerSize={4}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                        <Spinner animation="border" />
                        <p>Border</p>
                    </div>
                    <div>
                        <Spinner animation="grow" />
                        <p>Grow</p>
                    </div>
                    <div>
                        <Spinner animation="border" size="sm" />
                        <p>Border SM</p>
                    </div>
                    <div>
                        <Spinner animation="grow" size="sm" />
                        <p>Grow SM</p>
                    </div>
                </div>
            </Section>

            <Collapsible header="System Status">
                <p><Badge bg="success">Operational</Badge> API Server</p>
                <p><Badge bg="success">Operational</Badge> Database</p>
                <p><Badge bg="warning">Degraded</Badge> CDN</p>
                <p><Badge bg="danger">Down</Badge> Email Service</p>
            </Collapsible>

            <Collapsible header="Recent Activity">
                <ul>
                    <li>User <strong>alice</strong> created a new project <Badge bg="info">New</Badge></li>
                    <li>Deployment <strong>v2.4.1</strong> completed <Badge bg="success">Success</Badge></li>
                    <li>Build <strong>#1087</strong> failed <Badge bg="danger">Failed</Badge></li>
                    <li>User <strong>bob</strong> updated settings <Badge bg="primary">Update</Badge></li>
                </ul>
            </Collapsible>
        </Page>
    );
}
