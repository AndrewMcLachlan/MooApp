import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SaveIcon } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/SaveIcon",
    component: SaveIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onClick: { action: "clicked" },
    },
} satisfies Meta<typeof SaveIcon>;

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
        className: "text-success",
        onClick: fn(),
    },
};
