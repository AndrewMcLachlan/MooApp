import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer, Button } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

const meta = {
    title: "Moo App/Components/Drawer",
    component: Drawer,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        return (
            <>
                <Button onClick={() => setShow(true)}>Open Drawer</Button>
                <Drawer show={show} onHide={() => setShow(false)}>
                    <Drawer.Header closeButton>
                        <h5>Drawer Title</h5>
                    </Drawer.Header>
                    <Drawer.Body>
                        <p>Drawer body content goes here.</p>
                    </Drawer.Body>
                </Drawer>
            </>
        );
    },
};

export const EndPlacement: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        return (
            <>
                <Button onClick={() => setShow(true)}>Open Right Drawer</Button>
                <Drawer show={show} onHide={() => setShow(false)} placement="end">
                    <Drawer.Header closeButton>
                        <h5>Right Drawer</h5>
                    </Drawer.Header>
                    <Drawer.Body>
                        <p>This drawer slides in from the right.</p>
                    </Drawer.Body>
                </Drawer>
            </>
        );
    },
};
