import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Tooltip",
    component: Tooltip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        id: {
            control: "text",
            description: "Unique identifier for the tooltip",
        },
    },
    args: {
        id: "tooltip-1",
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        id: "default-tooltip",
        children: "This is helpful information",
    },
};

export const WithRichContent: Story = {
    args: {
        id: "rich-tooltip",
        children: (
            <div>
                <strong>Important:</strong>
                <br />
                This tooltip has multiple lines of content.
            </div>
        ),
    },
};

export const MultipleTooltips: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <span>
                First item <Tooltip id="tooltip-1">Information about the first item</Tooltip>
            </span>
            <span>
                Second item <Tooltip id="tooltip-2">Information about the second item</Tooltip>
            </span>
            <span>
                Third item <Tooltip id="tooltip-3">Information about the third item</Tooltip>
            </span>
        </div>
    ),
};

export const InlineWithText: Story = {
    render: () => (
        <p>
            This is some text with a tooltip <Tooltip id="inline-tooltip">
                Hover over the info icon to see this tooltip!
            </Tooltip> that provides additional context.
        </p>
    ),
};
