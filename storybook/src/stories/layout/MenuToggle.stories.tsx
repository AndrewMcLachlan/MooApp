import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MenuToggle } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Layout/MenuToggle",
    component: MenuToggle,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onClick: { action: "clicked" },
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof MenuToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onClick: fn(),
    },
};
