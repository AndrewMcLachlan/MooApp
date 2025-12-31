import type { Meta, StoryObj } from "@storybook/react-vite";
import { SortIcon } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/SortIcon",
    component: SortIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        direction: {
            control: "radio",
            options: ["Ascending", "Descending"],
        },
        hidden: {
            control: "boolean",
        },
    },
    args: {
        direction: "Ascending",
        hidden: false,
    },
} satisfies Meta<typeof SortIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ascending: Story = {
    args: {
        direction: "Ascending",
    },
};

export const Descending: Story = {
    args: {
        direction: "Descending",
    },
};

export const Hidden: Story = {
    args: {
        direction: "Ascending",
        hidden: true,
    },
};
