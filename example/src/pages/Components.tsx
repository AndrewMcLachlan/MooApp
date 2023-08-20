import { Section, useHttpClient, Page } from "@andrewmclachlan/mooapp";
import { Button } from "react-bootstrap";

export const Components = () => {

    const httpClient = useHttpClient();
    httpClient.get("fake").then(() => console.debug("Success")).catch((e) => console.debug(e));
    return (
        <Page title="Components" breadcrumbs={[{route: "/", text: "Components"}]} navItems={[{route: "/", text: "Components"}]}>
        <Section title="Components">
            <Button size="sm" variant="link">Sample</Button>
            <Button>Sample 2</Button>
        </Section>
        </Page>
    );
}