import { Section, useHttpClient } from "@andrewmclachlan/mooapp";
import { Button } from "react-bootstrap";

export const Components = () => {
    const httpClient = useHttpClient();
    httpClient.get("fake").then(() => console.debug("Success")).catch((e) => console.debug(e));
    return (
        <Section title="Components">
            <Button size="sm" variant="link">Sample</Button>
            <Button>Sample 2</Button>
        </Section>
    );
}