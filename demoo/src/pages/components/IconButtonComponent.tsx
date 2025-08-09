import { Page } from "@andrewmclachlan/moo-app";
import { IconButton, Section } from "@andrewmclachlan/moo-ds";
import { HamburgerMenu } from "../../assets";

export const IconButtonComponent = () => {
    return (
        <Page title="Icon Button">
            <Section title="Icon Button">
                <IconButton icon="plus" variant="primary">Create</IconButton>
                <IconButton icon={HamburgerMenu} variant="warning">Create</IconButton>
            </Section>
        </Page>
    );
};
