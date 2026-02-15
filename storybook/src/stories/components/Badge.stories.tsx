import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Badge",
    component: Badge,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <Badge>Badge</Badge>,
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
            <Badge bg="primary">Primary</Badge>
            <Badge bg="secondary">Secondary</Badge>
            <Badge bg="success">Success</Badge>
            <Badge bg="danger">Danger</Badge>
            <Badge bg="warning">Warning</Badge>
            <Badge bg="info">Info</Badge>
        </div>
    ),
};

export const Pills: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
            <Badge pill bg="primary">Primary</Badge>
            <Badge pill bg="success">Success</Badge>
            <Badge pill bg="danger">Danger</Badge>
        </div>
    ),
};
