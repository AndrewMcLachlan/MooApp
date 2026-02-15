import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

const meta = {
    title: "Moo App/Components/Alert",
    component: Alert,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <Alert>This is a primary alert.</Alert>,
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Alert variant="primary">Primary alert</Alert>
            <Alert variant="success">Success alert</Alert>
            <Alert variant="warning">Warning alert</Alert>
            <Alert variant="danger">Danger alert</Alert>
            <Alert variant="info">Info alert</Alert>
        </div>
    ),
};

export const WithHeading: Story = {
    render: () => (
        <Alert variant="success">
            <Alert.Heading>Well done!</Alert.Heading>
            <p>You successfully completed the operation.</p>
        </Alert>
    ),
};

export const Dismissible: Story = {
    render: () => {
        const [show, setShow] = useState(true);
        return (
            <>
                <Alert variant="warning" dismissible show={show} onClose={() => setShow(false)}>
                    This alert can be dismissed.
                </Alert>
                {!show && <button onClick={() => setShow(true)}>Show alert</button>}
            </>
        );
    },
};
