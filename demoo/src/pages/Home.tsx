import { Section, useHttpClient, Page, NavItemDivider, useMessages } from "@andrewmclachlan/mooapp";
import { Button } from "react-bootstrap";

export const Home = () => {

    const messages = useMessages();

    const addAlert = () => {
        messages?.sendMessage({ key:"m1", message: "This is a test alert", variant: "danger" });
    }

    return (
        <Page title="Home">
            <Section title="Home" header="Home" to="/components" headerSize={3}>
                <Button size="sm" variant="link">Sample</Button>
                <Button onClick={addAlert}>Show Alert</Button>
            </Section>
        </Page>
    );
}