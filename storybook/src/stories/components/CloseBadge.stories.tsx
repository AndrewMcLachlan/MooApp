import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CloseBadge } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/CloseBadge",
    component: CloseBadge,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        bg: {
            control: "select",
            options: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"],
        },
        onClose: { action: "closed" },
    },
    args: {
        children: "Badge Text",
        bg: "primary",
    },
} satisfies Meta<typeof CloseBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "Default Badge",
        onClose: fn(),
    },
};

export const Primary: Story = {
    args: {
        children: "Primary",
        bg: "primary",
        onClose: fn(),
    },
};

export const Secondary: Story = {
    args: {
        children: "Secondary",
        bg: "secondary",
        onClose: fn(),
    },
};

export const Success: Story = {
    args: {
        children: "Success",
        bg: "success",
        onClose: fn(),
    },
};

export const Danger: Story = {
    args: {
        children: "Danger",
        bg: "danger",
        onClose: fn(),
    },
};

export const Warning: Story = {
    args: {
        children: "Warning",
        bg: "warning",
        text: "dark",
        onClose: fn(),
    },
};

export const Info: Story = {
    args: {
        children: "Info",
        bg: "info",
        onClose: fn(),
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <CloseBadge bg="primary" onClose={fn()}>Primary</CloseBadge>
            <CloseBadge bg="secondary" onClose={fn()}>Secondary</CloseBadge>
            <CloseBadge bg="success" onClose={fn()}>Success</CloseBadge>
            <CloseBadge bg="danger" onClose={fn()}>Danger</CloseBadge>
            <CloseBadge bg="warning" text="dark" onClose={fn()}>Warning</CloseBadge>
            <CloseBadge bg="info" onClose={fn()}>Info</CloseBadge>
        </div>
    ),
};
