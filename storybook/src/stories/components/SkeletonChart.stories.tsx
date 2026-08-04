import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Skeleton.Chart",
    component: Skeleton.Chart,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Skeleton.Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Chart skeletons fill their container, so every story needs a sized box.
const box = { height: "12rem", maxWidth: "28rem" };

export const Bar: Story = {
    render: () => <div style={box}><Skeleton.Chart variant="bar" /></div>,
};

export const HorizontalBar: Story = {
    render: () => <div style={box}><Skeleton.Chart variant="horizontal-bar" /></div>,
};

export const Line: Story = {
    render: () => <div style={box}><Skeleton.Chart variant="line" /></div>,
};

export const Pie: Story = {
    render: () => <div style={box}><Skeleton.Chart variant="pie" /></div>,
};

export const Doughnut: Story = {
    render: () => <div style={box}><Skeleton.Chart variant="doughnut" /></div>,
};

/** `count` is bars, series lines, or slices depending on the variant. */
export const Counts: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={box}><Skeleton.Chart variant="bar" count={12} /></div>
            <div style={box}><Skeleton.Chart variant="line" count={4} /></div>
            <div style={box}><Skeleton.Chart variant="doughnut" count={3} /></div>
        </div>
    ),
};
