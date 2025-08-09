import { Icon, LinkBox, Page } from "@andrewmclachlan/moo-ds";
import { Col, Row } from "react-bootstrap";

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
