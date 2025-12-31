import type { Meta, StoryObj } from "@storybook/react-vite";
import { Notifications } from "@andrewmclachlan/moo-ds";
import { ThemeDecorator } from "../utils/decorators";
import { toast } from "react-toastify";

const meta = {
    title: "Moo App/Layout/Notifications",
    component: Notifications,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        ThemeDecorator,
        (Story) => (
            <div style={{ height: "400px", position: "relative" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Notifications>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: "The Notifications component renders a ToastContainer for displaying toast notifications. Use the react-toastify `toast` function to trigger notifications.",
            },
        },
    },
};

export const WithTriggerButtons: Story = {
    render: () => (
        <div>
            <Notifications />
            <div style={{ padding: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                    className="btn btn-success"
                    onClick={() => toast.success("Operation completed successfully!")}
                >
                    Success Toast
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => toast.error("An error occurred!")}
                >
                    Error Toast
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => toast.warning("Please review your input.")}
                >
                    Warning Toast
                </button>
                <button
                    className="btn btn-info"
                    onClick={() => toast.info("Here's some information.")}
                >
                    Info Toast
                </button>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Click the buttons to trigger different types of toast notifications.",
            },
        },
    },
};
