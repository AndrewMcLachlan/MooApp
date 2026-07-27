import { Page } from "@andrewmclachlan/moo-app";
import { Section, Button, toast } from "@andrewmclachlan/moo-ds";
import { feedbackNav } from "../../nav";

export const Notifications = () => {

    return (
        <Page title="Notifications" breadcrumbs={[{ route: "/feedback/alerts", text: "Feedback" }, { route: "/feedback/notifications", text: "Notifications" }]} navItems={feedbackNav}>

            <Section title="Toasts" header="toast()" headerSize={4}>
                <p>Transient, corner-of-screen notifications. Call <code>toast()</code> from anywhere; it stacks and auto-dismisses.</p>
                <div className="demo-row">
                    <Button onClick={() => toast("This is a test alert")}>Show Notification</Button>
                    <Button variant="secondary" onClick={() => toast("Another one, stacked on top")}>Show Another</Button>
                </div>
            </Section>

        </Page>
    );
}
