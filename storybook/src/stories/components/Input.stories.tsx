import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Input",
    component: Input,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
    render: () => <Input placeholder="Enter text..." />,
};

export const Check: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Input.Check id="check1" label="Default checkbox" />
            <Input.Check id="check2" label="Checked checkbox" defaultChecked />
        </div>
    ),
};

export const Radio: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Input.Check id="radio1" type="radio" name="group" label="Option one" defaultChecked />
            <Input.Check id="radio2" type="radio" name="group" label="Option two" />
        </div>
    ),
};

export const InlineChecks: Story = {
    render: () => (
        <div>
            <Input.Check id="inline1" label="One" inline />
            <Input.Check id="inline2" label="Two" inline />
            <Input.Check id="inline3" label="Three" inline />
        </div>
    ),
};

export const Switch: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Input.Switch id="switch1" label="Off switch" />
            <Input.Switch id="switch2" label="On switch" defaultChecked />
        </div>
    ),
};

export const Select: Story = {
    render: () => (
        <Input.Select>
            <option>Choose...</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
        </Input.Select>
    ),
};
