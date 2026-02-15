import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal, Button } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

const meta = {
    title: "Moo App/Components/Modal",
    component: Modal,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        show: {
            control: "boolean",
            description: "Whether the modal is visible",
        },
        size: {
            control: "radio",
            options: ["sm", "lg", "xl"],
            description: "Modal width size",
        },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        return (
            <>
                <Button onClick={() => setShow(true)}>Open Modal</Button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal Title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>This is the modal body content.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                        <Button onClick={() => setShow(false)}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    },
};

export const Small: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        return (
            <>
                <Button onClick={() => setShow(true)}>Small Modal</Button>
                <Modal show={show} onHide={() => setShow(false)} size="sm">
                    <Modal.Header closeButton>
                        <Modal.Title>Small Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>A compact modal for simple confirmations.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                        <Button onClick={() => setShow(false)}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    },
};

export const Large: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        return (
            <>
                <Button onClick={() => setShow(true)}>Large Modal</Button>
                <Modal show={show} onHide={() => setShow(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Large Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>A larger modal for more detailed content.</p>
                        <p>This could contain forms, tables, or other complex layouts that benefit from extra width.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                        <Button onClick={() => setShow(false)}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    },
};

export const ExtraLarge: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        return (
            <>
                <Button onClick={() => setShow(true)}>Extra Large Modal</Button>
                <Modal show={show} onHide={() => setShow(false)} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>Extra Large Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>An extra-large modal for wide content like data tables or dashboards.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    },
};

export const BodyOnly: Story = {
    render: () => {
        const [show, setShow] = useState(false);
        return (
            <>
                <Button onClick={() => setShow(true)}>Body Only Modal</Button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Body>
                        <p>A modal with only body content. Click the backdrop to close.</p>
                    </Modal.Body>
                </Modal>
            </>
        );
    },
};
