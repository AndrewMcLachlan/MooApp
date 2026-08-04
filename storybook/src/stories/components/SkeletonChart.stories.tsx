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


export const Bar: Story = {
    render: () => <div className="demo-box"><Skeleton.Chart variant="bar" /></div>,
};

export const HorizontalBar: Story = {
    render: () => <div className="demo-box"><Skeleton.Chart variant="horizontal-bar" /></div>,
};

export const Line: Story = {
    render: () => <div className="demo-box"><Skeleton.Chart variant="line" /></div>,
};

export const Pie: Story = {
    render: () => <div className="demo-box"><Skeleton.Chart variant="pie" /></div>,
};

export const Doughnut: Story = {
    render: () => <div className="demo-box"><Skeleton.Chart variant="doughnut" /></div>,
};

/** `count` is bars, series lines, or slices depending on the variant. */
export const Counts: Story = {
    render: () => (
        <div className="demo-row loose">
            <div className="demo-box"><Skeleton.Chart variant="bar" count={12} /></div>
            <div className="demo-box"><Skeleton.Chart variant="line" count={4} /></div>
            <div className="demo-box"><Skeleton.Chart variant="doughnut" count={3} /></div>
        </div>
    ),
};
