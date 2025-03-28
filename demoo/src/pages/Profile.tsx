import { Section, ThemeSelector, useHttpClient, Page, NavItemDivider, Themes } from "@andrewmclachlan/mooapp";
import { Button, Col, Row } from "react-bootstrap";

export const Profile = () => {

    return (
        <Page title="Profile">
            <Section title="Profile">
                <ThemeSelector />
            </Section>
        </Page>
    );
}
