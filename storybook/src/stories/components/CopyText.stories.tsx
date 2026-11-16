import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyText, Notifications } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/CopyText",
    component: CopyText,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <>
                <Story />
                <Notifications />
            </>
        ),
    ],
    tags: ["autodocs"],
    argTypes: {
        text: {
            control: "text",
            description: "The value copied to the clipboard",
        },
    },
} satisfies Meta<typeof CopyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: "#485",
    },
};

export const WithLabel: Story = {
    args: {
        text: "3f9c2a1e",
        children: "Commit 3f9c2a1",
    },
    parameters: {
        docs: {
            description: {
                story: "Children replace the visible text; the full value is still what gets copied.",
            },
        },
    },
};

export const Inline: Story = {
    args: {
        text: "#485",
    },
    render: (args) => (
        <p>
            Merged in pull request <CopyText {...args} /> last week.
        </p>
    ),
};
