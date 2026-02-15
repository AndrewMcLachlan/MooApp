import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Button",
    component: Button,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <Button>Primary Button</Button>,
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="link">Link</Button>
        </div>
    ),
};

export const OutlineVariants: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="outline-primary">Primary</Button>
            <Button variant="outline-secondary">Secondary</Button>
            <Button variant="outline-success">Success</Button>
            <Button variant="outline-danger">Danger</Button>
            <Button variant="outline-warning">Warning</Button>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

export const Disabled: Story = {
    render: () => <Button disabled>Disabled</Button>,
};
