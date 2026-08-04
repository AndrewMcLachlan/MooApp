import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Spinner",
    component: Spinner,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// delay={0} throughout: the 300ms default exists so short fetches never flash a
// spinner, which in a story just looks like a story that failed to render.

export const Comet: Story = {
    render: () => <Spinner delay={0} />,
};

export const Border: Story = {
    render: () => <Spinner animation="border" delay={0} />,
};

export const Small: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "1rem" }}>
            <Spinner size="sm" delay={0} />
            <Spinner animation="border" size="sm" delay={0} />
        </div>
    ),
};

/** The default 300ms delay in action — remount the story to watch it wait. */
export const Delayed: Story = {
    render: () => <Spinner />,
};
