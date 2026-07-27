import { Page } from "@andrewmclachlan/moo-app";
import { Section, Button, ButtonGroup, IconButton, IconLinkButton, LinkBox, Icon, Col, Row } from "@andrewmclachlan/moo-ds";
import { HamburgerMenu } from "@andrewmclachlan/moo-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { formsNav } from "../../nav";

export const Buttons = () => {

    const [buttonLoading, setButtonLoading] = useState(false);

    return (
        <Page title="Buttons" breadcrumbs={[{ route: "/forms/form", text: "Forms" }, { route: "/forms/buttons", text: "Buttons" }]} navItems={formsNav}>

            <Section title="Button" header="Button" headerSize={4}>
                <p>The standard action control across variants and sizes.</p>
                <div className="demo-row">
                    <Button size="sm" variant="link">Link</Button>
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline-primary">Outline</Button>
                    <Button variant="danger">Danger</Button>
                    <Button disabled>Disabled</Button>
                </div>
            </Section>

            <Section title="Button loading state" header="Button loading state" headerSize={4}>
                <p>The <code>loading</code> prop shows an inline spinner and disables the button (and is inert across <code>as</code> variants). Use the toggle to hold a button in its busy state.</p>
                <div className="demo-row tight">
                    <Button variant="outline-secondary" onClick={() => setButtonLoading((l) => !l)}>
                        {buttonLoading ? "Stop loading" : "Start loading"}
                    </Button>
                    <Button loading={buttonLoading} onClick={() => setButtonLoading(false)}>Save</Button>
                    <Button variant="outline-primary" loading={buttonLoading}>Save</Button>
                    <Button variant="secondary" size="sm" loading={buttonLoading}>Save</Button>
                    <Button as="a" href="https://example.com" loading={buttonLoading}>Anchor (inert)</Button>
                </div>
                <p className="demo-subhead">On an <code>IconButton</code> the icon itself becomes the spinner:</p>
                <div className="demo-row tight">
                    <IconButton icon={faPlus} loading={buttonLoading}>Create</IconButton>
                    <IconButton icon={faPlus} badge loading={buttonLoading}>Create</IconButton>
                </div>
            </Section>

            <Section title="Button Groups" header="Button Groups" headerSize={4}>
                <p>Segmented actions joined into a single control.</p>
                <div className="demo-row">
                    <ButtonGroup>
                        <Button>Save</Button>
                        <Button variant="secondary">Draft</Button>
                        <Button variant="danger">Cancel</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button size="sm" variant="outline-primary">Day</Button>
                        <Button size="sm" variant="outline-primary">Week</Button>
                        <Button size="sm" variant="outline-primary">Month</Button>
                        <Button size="sm" variant="outline-primary">Year</Button>
                    </ButtonGroup>
                </div>
            </Section>

            <Section title="Icon Button" header="IconButton" headerSize={4}>
                <p>A button with a leading icon; <code>badge</code> renders it as a compact badge-style action.</p>
                <div className="demo-row">
                    <IconButton icon="plus" variant="primary">Create</IconButton>
                    <IconButton icon={HamburgerMenu} variant="warning">Menu</IconButton>
                </div>
                <div className="demo-row demo-subhead">
                    <IconButton icon="plus" variant="primary" badge>Add Account</IconButton>
                    <IconButton icon="plus" variant="danger" badge>Add Account</IconButton>
                    <IconButton icon="plus" variant="success" badge>Add Account</IconButton>
                </div>
            </Section>

            <Section title="Icon Link Button" header="IconLinkButton" headerSize={4}>
                <p>The same affordance as <code>IconButton</code>, but it navigates via the router instead of firing an <code>onClick</code>.</p>
                <div className="demo-row">
                    <IconLinkButton to="/forms/buttons" icon="plus" variant="primary">Create</IconLinkButton>
                    <IconLinkButton to="/forms/buttons" icon={HamburgerMenu} variant="warning">Menu</IconLinkButton>
                </div>
                <div className="demo-row demo-subhead">
                    <IconLinkButton to="/forms/buttons" icon="plus" variant="primary" badge>Add Account</IconLinkButton>
                    <IconLinkButton to="/forms/buttons" icon="plus" variant="danger" badge>Add Account</IconLinkButton>
                    <IconLinkButton to="/forms/buttons" icon="plus" variant="success" badge>Add Account</IconLinkButton>
                </div>
            </Section>

            <Section title="Link Box" header="LinkBox" headerSize={4}>
                <p>A large tile-style link with an icon or image &mdash; useful for landing-page navigation.</p>
                <Row>
                    <Col md={2}>
                        <LinkBox to="/forms/buttons" image={<Icon icon="plus" />}>Create</LinkBox>
                    </Col>
                    <Col md={2}>
                        <LinkBox to="/forms/buttons" image="https://cdn.mclachlan.family/images/logos/entra.svg">Entra</LinkBox>
                    </Col>
                </Row>
            </Section>

        </Page>
    );
}
