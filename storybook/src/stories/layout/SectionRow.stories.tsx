import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionRow } from "@andrewmclachlan/moo-ds";
import { Col } from "react-bootstrap";

const meta = {
    title: "Moo App/Layout/SectionRow",
    component: SectionRow,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof SectionRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <>
                <Col>Column 1</Col>
                <Col>Column 2</Col>
                <Col>Column 3</Col>
            </>
        ),
    },
};

export const WithMultipleColumns: Story = {
    args: {
        children: (
            <>
                <Col md={6}>Left Column (6)</Col>
                <Col md={6}>Right Column (6)</Col>
            </>
        ),
    },
};

export const ThreeColumnLayout: Story = {
    args: {
        children: (
            <>
                <Col md={4}>
                    <div className="p-3 border">Column 1</div>
                </Col>
                <Col md={4}>
                    <div className="p-3 border">Column 2</div>
                </Col>
                <Col md={4}>
                    <div className="p-3 border">Column 3</div>
                </Col>
            </>
        ),
    },
};

export const NestedContent: Story = {
    args: {
        children: (
            <>
                <Col md={8}>
                    <div className="p-3 border">
                        <h4>Main Content</h4>
                        <p>This is the main content area with nested elements.</p>
                        <ul>
                            <li>Item 1</li>
                            <li>Item 2</li>
                            <li>Item 3</li>
                        </ul>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-3 border">
                        <h4>Sidebar</h4>
                        <p>Additional information</p>
                    </div>
                </Col>
            </>
        ),
    },
};

export const SingleColumn: Story = {
    args: {
        children: (
            <Col>
                <div className="p-3 border">
                    Full-width single column content
                </div>
            </Col>
        ),
    },
};
