import { Page, useHttpClient } from "@andrewmclachlan/moo-app";
import { Section, Button } from "@andrewmclachlan/moo-ds";
import { Tags } from "../assets";

export const Providers = () => {

    const httpClient = useHttpClient();
    httpClient.get("fake").then(() => console.debug("Success")).catch((e) => console.debug(e));
    return (
        <Page title="Providers" breadcrumbs={[{route: "/", text: "Components"}]} navItems={[
            {route: "/providers/app", image: <Tags />, text: "App Provider" },
            {route: "/providers/layout", image: <Tags />, text: "Layout Provider" },
            {route: "/providers/httpclient", image: <Tags />, text: "HTTP Client Provider" } ]}>
        <Section title="Components">
            <Button size="sm" variant="link">Sample</Button>
            <Button>Sample 2</Button>
        </Section>
        </Page>
    );
}