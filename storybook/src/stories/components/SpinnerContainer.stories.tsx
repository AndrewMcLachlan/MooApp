import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpinnerContainer } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/SpinnerContainer",
    component: SpinnerContainer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof SpinnerContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
