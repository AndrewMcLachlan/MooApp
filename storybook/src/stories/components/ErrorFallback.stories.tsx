import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ErrorFallback } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/ErrorFallback",
    component: ErrorFallback,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        message: {
            control: "text",
            description: "Additional message to display",
        },
        dismissible: {
            control: "boolean",
            description: "Whether the alert can be dismissed",
        },
    },
    args: {
        error: new Error("An unexpected error occurred"),
        resetErrorBoundary: fn(),
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        error: new Error("Something went wrong while loading the data."),
        resetErrorBoundary: fn(),
    },
};

export const WithMessage: Story = {
    args: {
        error: new Error("Network request failed"),
        message: "Please check your internet connection and try again.",
        resetErrorBoundary: fn(),
    },
};

export const Dismissible: Story = {
    args: {
        error: new Error("Failed to save changes"),
        message: "Your changes could not be saved. Please try again.",
        dismissible: true,
        resetErrorBoundary: fn(),
        onClose: fn(),
    },
};

export const NonDismissible: Story = {
    args: {
        error: new Error("Critical error occurred"),
        message: "Please contact support if this issue persists.",
        dismissible: false,
        resetErrorBoundary: fn(),
    },
};

export const LongErrorMessage: Story = {
    args: {
        error: new Error("TypeError: Cannot read properties of undefined (reading 'map') at UserList.render (UserList.tsx:42:15) at processChild (react-dom.development.js:4567:14)"),
        message: "An error occurred while rendering the user list. The development team has been notified.",
        dismissible: true,
        resetErrorBoundary: fn(),
        onClose: fn(),
    },
};
