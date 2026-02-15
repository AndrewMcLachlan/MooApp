import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, OverlayTrigger, Button } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Popover",
    component: Popover,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <OverlayTrigger
            trigger="click"
            placement="bottom"
            rootClose
            overlay={
                <Popover id="demo-popover">
                    <Popover.Header>Popover Title</Popover.Header>
                    <Popover.Body>This is the popover content.</Popover.Body>
                </Popover>
            }
        >
            <Button>Click me</Button>
        </OverlayTrigger>
    ),
};

export const HoverTrigger: Story = {
    render: () => (
        <OverlayTrigger
            trigger="hover"
            placement="top"
            overlay={
                <Popover id="hover-popover">
                    <Popover.Body>Hover popover content.</Popover.Body>
                </Popover>
            }
        >
            <Button variant="secondary">Hover me</Button>
        </OverlayTrigger>
    ),
};
