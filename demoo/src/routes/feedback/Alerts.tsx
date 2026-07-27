import { Page } from "@andrewmclachlan/moo-app";
import { Section, Alert, Button, useMessages } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { feedbackNav } from "../../nav";

export const Alerts = () => {

    const messages = useMessages();
    const [showWarning, setShowWarning] = useState(true);

    return (
        <Page title="Alerts & Messages" breadcrumbs={[{ route: "/feedback/alerts", text: "Feedback" }, { route: "/feedback/alerts", text: "Alerts & Messages" }]} navItems={feedbackNav}>

            <Section title="Alerts" header="Alert" headerSize={4}>
                <p>Inline, coloured status banners. A heading is optional and they can be made dismissible.</p>
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

            <Section title="Messages" header="Message provider (useMessages)" headerSize={4}>
                <p>
                    <code>useMessages</code> pushes an app-level message into the shell&rsquo;s message
                    region &mdash; the same channel the framework uses to surface errors. Send one and
                    it appears at the top of the layout.
                </p>
                <div className="demo-row">
                    <Button onClick={() => messages.sendMessage({ key: "info", message: "Saved your changes.", variant: "success" })}>Send success</Button>
                    <Button variant="danger" onClick={() => messages.sendMessage({ key: "err", message: "Something went wrong.", variant: "danger" })}>Send error</Button>
                </div>
            </Section>

        </Page>
    );
}
