import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitButton, Menu } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/SplitButton",
    component: SplitButton,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    args: {
        id: "split-button",
        label: "Add transaction",
    },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
    <>
        <Menu.Item icon="plus">Add transfer</Menu.Item>
        <Menu.Item icon="upload">Import from file</Menu.Item>
    </>
);

export const Default: Story = {
    render: (args) => <SplitButton {...args}>{items}</SplitButton>,
};

export const WithIcon: Story = {
    render: (args) => <SplitButton {...args} icon="plus" toggleLabel="More add options">{items}</SplitButton>,
};

export const Variants: Story = {
    render: () => (
        <div className="demo-row tight">
            <SplitButton id="primary" label="Primary">{items}</SplitButton>
            <SplitButton id="outline" label="Outline" variant="outline-primary">{items}</SplitButton>
            <SplitButton id="secondary" label="Secondary" variant="secondary">{items}</SplitButton>
            <SplitButton id="danger" label="Danger" variant="danger">{items}</SplitButton>
        </div>
    ),
};

export const Small: Story = {
    render: (args) => <SplitButton {...args} size="sm">{items}</SplitButton>,
};

export const Disabled: Story = {
    render: (args) => <SplitButton {...args} disabled>{items}</SplitButton>,
};
