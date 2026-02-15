import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Spinner",
    component: Spinner,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Border: Story = {
    render: () => <Spinner />,
};

export const Grow: Story = {
    render: () => <Spinner animation="grow" />,
};

export const Small: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "1rem" }}>
            <Spinner size="sm" />
            <Spinner animation="grow" size="sm" />
        </div>
    ),
};
