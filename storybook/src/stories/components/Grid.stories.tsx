import type { Meta, StoryObj } from "@storybook/react-vite";
import { Row, Col } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Grid",
    component: Row,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;


export const EqualColumns: Story = {
    render: () => (
        <Row>
            <Col className="demo-swatch">Col</Col>
            <Col className="demo-swatch">Col</Col>
            <Col className="demo-swatch">Col</Col>
        </Row>
    ),
};

export const SpecificWidths: Story = {
    render: () => (
        <Row>
            <Col xs={4} className="demo-swatch">xs=4</Col>
            <Col xs={8} className="demo-swatch">xs=8</Col>
        </Row>
    ),
};

export const Responsive: Story = {
    render: () => (
        <Row>
            <Col xs={12} md={6} lg={4} className="demo-swatch">xs=12 md=6 lg=4</Col>
            <Col xs={12} md={6} lg={4} className="demo-swatch">xs=12 md=6 lg=4</Col>
            <Col xs={12} md={12} lg={4} className="demo-swatch">xs=12 md=12 lg=4</Col>
        </Row>
    ),
};
