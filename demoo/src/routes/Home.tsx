import { Page } from "@andrewmclachlan/moo-app";
import { Section, useMessages, Button, Widget, Badge, Spinner, Collapsible, Row, Col } from "@andrewmclachlan/moo-ds";
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
            <Row>
                <Col sm={6} xl={3}>
                    <Widget header="Total Users" size="single" headerSize={5}>
                        <p className="stat">1,234</p>
                        <Badge bg="success">+12%</Badge>
                    </Widget>
                </Col>
                <Col sm={6} xl={3}>
                    <Widget header="Revenue" size="single" headerSize={5}>
                        <p className="stat">$45,678</p>
                        <Badge bg="danger">-3%</Badge>
                    </Widget>
                </Col>
                <Col sm={6} xl={3}>
                    <Widget header="Active Sessions" size="single" headerSize={5} loading={widgetLoading}>
                        <p className="stat">342</p>
                        <Badge bg="info">Live</Badge>
                    </Widget>
                </Col>
                <Col sm={6} xl={3}>
                    <Widget header="View Reports" size="single" headerSize={5} to="/data/table">
                        <p className="stat">28</p>
                        <Badge bg="warning">Pending</Badge>
                    </Widget>
                </Col>
            </Row>

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
