import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Skeleton",
    component: Skeleton,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "Shimmering placeholders for content whose shape is known ahead of time " +
                    "(text, avatars, blocks, table rows). Prefer a skeleton when the placeholder " +
                    "can mirror the real layout; prefer a Spinner when the content shape is unknown " +
                    "or irregular (charts, reports). The moving gradient respects `prefers-reduced-motion`.",
            },
        },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rect: Story = {
    render: () => (
        <div style={{ width: 240, height: 120 }}>
            <Skeleton.Rect />
        </div>
    ),
};

export const Text: Story = {
    render: () => (
        <div style={{ width: 320 }}>
            <Skeleton.Text lines={4} />
        </div>
    ),
};

export const Circle: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Skeleton.Circle size="sm" />
            <Skeleton.Circle size="md" />
            <Skeleton.Circle size="lg" />
        </div>
    ),
};

export const MediaObject: Story = {
    name: "Composed: media object",
    render: () => (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", width: 360 }}>
            <Skeleton.Circle size="lg" />
            <div style={{ flex: 1 }}>
                <Skeleton.Text lines={3} />
            </div>
        </div>
    ),
};
