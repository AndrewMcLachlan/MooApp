import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { DeleteIcon } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/DeleteIcon",
    component: DeleteIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onClick: { action: "clicked" },
    },
} satisfies Meta<typeof DeleteIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithOnClick: Story = {
    args: {
        onClick: fn(),
    },
};

export const WithClassName: Story = {
    args: {
        className: "text-danger",
        onClick: fn(),
    },
};
