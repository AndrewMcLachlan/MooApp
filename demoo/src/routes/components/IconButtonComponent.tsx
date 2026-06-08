import { Page } from "@andrewmclachlan/moo-app";
import { IconButton, Section } from "@andrewmclachlan/moo-ds";
import { HamburgerMenu } from "@andrewmclachlan/moo-icons";

export const IconButtonComponent = () => {
    return (
        <Page title="Icon Button">
            <Section className="buttons" title="Icon Button">
                <IconButton icon="plus" variant="primary">Create</IconButton>
                <IconButton icon={HamburgerMenu} variant="warning">Create</IconButton>
            </Section>
            <Section className="buttons" title="Badge">
                <IconButton icon="plus" variant="primary" badge>Add Account</IconButton>
                <IconButton icon="plus" variant="danger" badge>Add Account</IconButton>
                <IconButton icon="plus" variant="success" badge>Add Account</IconButton>
            </Section>
        </Page>
    );
};
