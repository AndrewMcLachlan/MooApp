import { Section, useHttpClient, Page, NavItemDivider } from "@andrewmclachlan/mooapp";
import { Button } from "react-bootstrap";

export const Profile = () => {

    return (
        <Page title="Profile">
        <Section title="Profile">
            <Button size="sm" variant="link">Sample</Button>
            <Button>Sample 2</Button>
        </Section>
        </Page>
    );
}
