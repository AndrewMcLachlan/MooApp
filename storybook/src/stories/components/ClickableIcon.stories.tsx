import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ClickableIcon } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/ClickableIcon",
    component: ClickableIcon,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: "**Deprecated:** Use `Icon` component with `onClick` prop instead.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        icon: {
            control: "text",
            description: "FontAwesome icon name",
        },
        onClick: { action: "clicked" },
    },
    args: {
        icon: "edit",
    },
} satisfies Meta<typeof ClickableIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * @deprecated Use Icon component with onClick instead
 */
export const Default: Story = {
    args: {
        icon: "edit",
        onClick: fn(),
    },
};

export const DifferentIcons: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "16px" }}>
            <ClickableIcon icon="trash" onClick={fn()} />
            <ClickableIcon icon="edit" onClick={fn()} />
            <ClickableIcon icon="check" onClick={fn()} />
        </div>
    ),
};
