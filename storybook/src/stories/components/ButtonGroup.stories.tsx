import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup, Button } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/ButtonGroup",
    component: ButtonGroup,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <ButtonGroup>
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
        </ButtonGroup>
    ),
};

export const OutlineVariant: Story = {
    render: () => (
        <ButtonGroup>
            <Button variant="outline-primary">Left</Button>
            <Button variant="outline-primary">Middle</Button>
            <Button variant="outline-primary">Right</Button>
        </ButtonGroup>
    ),
};
