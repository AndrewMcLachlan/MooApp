import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alerts, MessageProvider } from "@andrewmclachlan/moo-ds";
import { Alert } from "react-bootstrap";

const meta = {
    title: "Moo App/Layout/Alerts",
    component: Alerts,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MessageProvider>
                <Story />
            </MessageProvider>
        ),
    ],
} satisfies Meta<typeof Alerts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: "The Alerts component displays messages from the MessageProvider context. In this example, there are no messages to display.",
            },
        },
    },
};

// Since Alerts requires MessageProvider context and we can't easily mock the messages,
// we'll create demo stories that show what alerts look like using the underlying Alert component
export const SingleAlertDemo: Story = {
    render: () => (
        <div className="alerts">
            <Alert dismissible variant="info" show>
                This is an informational message
            </Alert>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Demo of a single alert. In actual usage, alerts are managed through the MessageProvider context.",
            },
        },
    },
};

export const MultipleAlertsDemo: Story = {
    render: () => (
        <div className="alerts">
            <Alert dismissible variant="success" show>
                Operation completed successfully!
            </Alert>
            <Alert dismissible variant="warning" show>
                Please review the changes before proceeding.
            </Alert>
            <Alert dismissible variant="danger" show>
                An error occurred while saving.
            </Alert>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: "Demo of multiple alerts with different variants.",
            },
        },
    },
};

export const AllVariantsDemo: Story = {
    render: () => (
        <div className="alerts">
            <Alert dismissible variant="primary" show>
                Primary alert message
            </Alert>
            <Alert dismissible variant="secondary" show>
                Secondary alert message
            </Alert>
            <Alert dismissible variant="success" show>
                Success alert message
            </Alert>
            <Alert dismissible variant="danger" show>
                Danger alert message
            </Alert>
            <Alert dismissible variant="warning" show>
                Warning alert message
            </Alert>
            <Alert dismissible variant="info" show>
                Info alert message
            </Alert>
        </div>
    ),
};
