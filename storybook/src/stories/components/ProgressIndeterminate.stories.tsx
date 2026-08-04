import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressIndeterminate, Section } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/ProgressIndeterminate",
    component: ProgressIndeterminate,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ProgressIndeterminate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
    render: () => <ProgressIndeterminate />,
};

/**
 * Pinned to the top edge of its host, with `is-refreshing` receding the stale
 * data rather than replacing it. This is the point of the component: the panel
 * keeps showing what it already has.
 */
export const Edge: Story = {
    render: () => (
        <Section header="Revenue" headerSize={5} className="is-refreshing">
            <ProgressIndeterminate variant="edge" aria-label="Refreshing" />
            <p className="stat">$45,678</p>
        </Section>
    ),
};
