import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container, Row, Col } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Grid",
    component: Container,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const colStyle = { background: "var(--primary)", color: "white", padding: "0.75rem", textAlign: "center" as const, borderRadius: "0.25rem" };

export const EqualColumns: Story = {
    render: () => (
        <Container>
            <Row style={{ gap: "0.5rem" }}>
                <Col style={colStyle}>Col</Col>
                <Col style={colStyle}>Col</Col>
                <Col style={colStyle}>Col</Col>
            </Row>
        </Container>
    ),
};

export const SpecificWidths: Story = {
    render: () => (
        <Container>
            <Row style={{ gap: "0.5rem" }}>
                <Col xs={4} style={colStyle}>xs=4</Col>
                <Col xs={8} style={colStyle}>xs=8</Col>
            </Row>
        </Container>
    ),
};

export const Responsive: Story = {
    render: () => (
        <Container>
            <Row style={{ gap: "0.5rem" }}>
                <Col xs={12} md={6} lg={4} style={colStyle}>xs=12 md=6 lg=4</Col>
                <Col xs={12} md={6} lg={4} style={colStyle}>xs=12 md=6 lg=4</Col>
                <Col xs={12} md={12} lg={4} style={colStyle}>xs=12 md=12 lg=4</Col>
            </Row>
        </Container>
    ),
};

export const FluidContainer: Story = {
    render: () => (
        <Container fluid>
            <Row style={{ gap: "0.5rem" }}>
                <Col style={colStyle}>Full-width container</Col>
                <Col style={colStyle}>Full-width container</Col>
            </Row>
        </Container>
    ),
};
