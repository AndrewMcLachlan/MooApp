import { Page } from "@andrewmclachlan/moo-app";
import { Section, useMessages, Button, Widget, Badge, Kpi, Skeleton, Spinner, Collapsible, Row, Col } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

export const Home = () => {

    const messages = useMessages();
    const [widgetLoading, setWidgetLoading] = useState(false);

    const addAlert = () => {
        messages.sendMessage({ key: "m1", message: "This is a test alert", variant: "danger" });
    }

    return (
        <Page title="Home">
            <Section title="Dashboard" header="Dashboard" headerSize={3}>
                <p>The landing page a real app shell would show: a row of stat widgets, a few live controls and some collapsible panels &mdash; the components you reach for first, shown together in context.</p>
                <div className="demo-row">
                    <Button onClick={addAlert}>Show Alert</Button>
                    <Button variant="outline-primary" onClick={() => setWidgetLoading(!widgetLoading)}>Toggle Widget Loading</Button>
                </div>
            </Section>

            {/* Widget's `size` only means something inside Dashboard's grid, so in a
                Row each one needs a Col to sit in -- `.row > *` is width: 100% otherwise. */}
            {/* A figure with a label and a caption is a Kpi, not a Widget with a paragraph in
                it. Widget still earns its place below, where the tile is a container for
                arbitrary content and wants its loading and click-through behaviour. */}
            <div className="home-kpis">
                <Kpi label="Total Users" tone="success">
                    <Kpi.Value>{widgetLoading ? <Skeleton.Text /> : "1,234"}</Kpi.Value>
                    <Kpi.Sub>up 12% on last month</Kpi.Sub>
                </Kpi>
                <Kpi label="Revenue" tone="danger">
                    <Kpi.Value>{widgetLoading ? <Skeleton.Text /> : "$45,678"}</Kpi.Value>
                    <Kpi.Sub>down 3% on last month</Kpi.Sub>
                </Kpi>
                <Kpi label="Active Sessions" tone="info">
                    <Kpi.Value>{widgetLoading ? <Skeleton.Text /> : "342"}</Kpi.Value>
                    <Kpi.Sub>live right now</Kpi.Sub>
                </Kpi>
                <Kpi label="Pending Reports" tone="warning">
                    <Kpi.Value>{widgetLoading ? <Skeleton.Text /> : "28"}</Kpi.Value>
                    <Kpi.Sub>awaiting review</Kpi.Sub>
                </Kpi>
            </div>

            <Section title="Spinners" header="Spinner Variants" headerSize={4}>
                <div className="demo-row loose">
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner delay={0} /></div>
                        <p>Comet</p>
                    </div>
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner animation="border" delay={0} /></div>
                        <p>Border</p>
                    </div>
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner size="sm" delay={0} /></div>
                        <p>Comet SM</p>
                    </div>
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner animation="border" size="sm" delay={0} /></div>
                        <p>Border SM</p>
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
