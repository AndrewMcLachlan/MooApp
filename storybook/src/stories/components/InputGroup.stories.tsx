import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputGroup, Input } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/InputGroup",
    component: InputGroup,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <InputGroup>
            <InputGroup.Text>@</InputGroup.Text>
            <Input placeholder="Username" />
        </InputGroup>
    ),
};

export const WithSuffix: Story = {
    render: () => (
        <InputGroup>
            <Input placeholder="Amount" />
            <InputGroup.Text>.00</InputGroup.Text>
        </InputGroup>
    ),
};

export const WithBothSides: Story = {
    render: () => (
        <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Input placeholder="Amount" />
            <InputGroup.Text>.00</InputGroup.Text>
        </InputGroup>
    ),
};
