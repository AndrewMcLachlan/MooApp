import { Section, useHttpClient, Page, NavItemDivider } from "@andrewmclachlan/mooapp";
import { Button } from "react-bootstrap";

export const Home = () => {

    return (
        <Page title="Home">
        <Section title="Home">
            <Button size="sm" variant="link">Sample</Button>
            <Button>Sample 2</Button>
        </Section>
        </Page>
    );
}