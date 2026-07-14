import { Page } from "@andrewmclachlan/moo-app";
import { Section, Button } from "@andrewmclachlan/moo-ds";
import { Tags } from "@andrewmclachlan/moo-icons";

export const Providers = () => {

    return (
        <Page title="Providers" breadcrumbs={[{route: "/", text: "Components"}]} navItems={[
            {route: "/providers/app", image: <Tags />, text: "App Provider" },
            {route: "/providers/layout", image: <Tags />, text: "Layout Provider" },
            {route: "/providers/auth", image: <Tags />, text: "MSAL Auth Provider" } ]}>
        <Section title="Components">
            <Button size="sm" variant="link">Sample</Button>
            <Button>Sample 2</Button>
        </Section>
        </Page>
    );
}
