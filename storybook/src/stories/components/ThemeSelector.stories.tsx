import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeSelector } from "@andrewmclachlan/moo-ds";
import { ThemeDecorator } from "../utils/decorators";

const meta = {
    title: "Moo App/Components/ThemeSelector",
    component: ThemeSelector,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [ThemeDecorator],
} satisfies Meta<typeof ThemeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
