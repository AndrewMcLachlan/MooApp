import { Page } from "@andrewmclachlan/moo-app";
import { Section, ThemeSelector } from "@andrewmclachlan/moo-ds";

export const Profile = () => {

    return (
        <Page title="Profile">
            <Section title="Profile">
                <ThemeSelector />
            </Section>
        </Page>
    );
}
