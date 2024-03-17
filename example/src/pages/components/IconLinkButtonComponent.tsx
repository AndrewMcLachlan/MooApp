import { IconLinkButton, Page, Section } from "@andrewmclachlan/mooapp";
import { Tags, UpDownArrow } from "../../assets";

export const IconLinkButtonComponent = () => {
    return (
        <Page title="Icon Link Button">
            <Section title="Icon Link Button">
                <IconLinkButton to="/components" icon="plus" variant="warning">Create</IconLinkButton>
                <IconLinkButton to="/components" customIcon={UpDownArrow} variant="warning">Create</IconLinkButton>
            </Section>
        </Page>
    );
};
