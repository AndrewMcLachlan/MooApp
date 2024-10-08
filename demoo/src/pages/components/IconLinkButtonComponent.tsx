import { IconLinkButton, Page, Section } from "@andrewmclachlan/mooapp";
import { HamburgerMenu, Tags, UpDownArrow } from "../../assets";

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
