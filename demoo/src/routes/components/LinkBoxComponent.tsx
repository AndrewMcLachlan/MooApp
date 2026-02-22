import { Page } from "@andrewmclachlan/moo-app";
import { Icon, LinkBox, Col, Row } from "@andrewmclachlan/moo-ds";

export const LinkBoxComponent = () => {
    return (
        <Page title="Icon Link Button">
            <Row>
                <Col md={2}>
                    <LinkBox to="/components" image={<Icon icon="plus" />}>Create</LinkBox>
                </Col>
                <Col md={2}>
                    <LinkBox to="/components" image="https://cdn.mclachlan.family/images/logos/entra.svg">Entra</LinkBox>
                </Col>
            </Row>
        </Page>
    );
};
