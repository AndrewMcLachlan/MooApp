import { Page } from "@andrewmclachlan/moo-app";
import { IconLinkButton, Section } from "@andrewmclachlan/moo-ds";
import { HamburgerMenu } from "@andrewmclachlan/moo-icons";

export const IconLinkButtonComponent = () => {
    return (
        <Page title="Icon Link Button">
            <Section title="Icon Link Button">
                <IconLinkButton to="/components" icon="plus" variant="primary">Create</IconLinkButton>
                <IconLinkButton to="/components" icon={HamburgerMenu} variant="warning">Create</IconLinkButton>
            </Section>
        </Page>
    );
};
