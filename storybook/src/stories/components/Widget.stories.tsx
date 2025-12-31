import type { Meta, StoryObj } from "@storybook/react-vite";
import { Widget } from "@andrewmclachlan/moo-ds";
import { Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const meta = {
    title: "Moo App/Components/Widget",
    component: Widget,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        loading: {
            control: "boolean",
            description: "Show loading spinner",
        },
        header: {
            control: "text",
            description: "Widget header text or component",
        },
        size: {
            control: "radio",
            options: ["single", "double"],
            description: "Widget width size",
        },
        headerSize: {
            control: "select",
            options: [1, 2, 3, 4, 5, 6],
            description: "Header element size (h1-h6)",
        },
        to: {
            control: "text",
            description: "Link destination for the header",
        },
    },
    args: {
        size: "single",
    },
    decorators: [
        (Story) => (
            <Row>
                <Story />
            </Row>
        ),
    ],
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSize: Story = {
    args: {
        header: "Single Widget",
        size: "single",
        children: (
            <p>This is a single-width widget with some content inside.</p>
        ),
    },
};

export const DoubleSize: Story = {
    args: {
        header: "Double Widget",
        size: "double",
        children: (
            <p>This is a double-width widget that spans more columns.</p>
        ),
    },
};

export const Loading: Story = {
    args: {
        header: "Loading Widget",
        size: "single",
        loading: true,
        children: <p>This content won't be shown while loading.</p>,
    },
};

export const WithHeader: Story = {
    args: {
        header: "Dashboard Stats",
        size: "single",
        children: (
            <div>
                <p>Total Users: 1,234</p>
                <p>Active Sessions: 56</p>
            </div>
        ),
    },
};

export const WithReactNodeHeader: Story = {
    args: {
        header: (
            <span>
                <FontAwesomeIcon icon="chart-line" style={{ marginRight: "8px" }} />
                Analytics Dashboard
            </span>
        ),
        size: "single",
        children: (
            <div>
                <p>Page Views: 45,678</p>
                <p>Bounce Rate: 32%</p>
            </div>
        ),
    },
};

export const WithLink: Story = {
    args: {
        header: "View All Users",
        size: "single",
        to: "/users",
        children: (
            <p>Click the header to navigate to the users page.</p>
        ),
    },
};

export const DifferentHeaderSizes: Story = {
    render: () => (
        <>
            <Widget header="Header Size 2" headerSize={2} size="single">
                <p>Using h2 element</p>
            </Widget>
            <Widget header="Header Size 4" headerSize={4} size="single">
                <p>Using h4 element</p>
            </Widget>
            <Widget header="Header Size 6" headerSize={6} size="single">
                <p>Using h6 element</p>
            </Widget>
        </>
    ),
};

export const MultipleWidgets: Story = {
    render: () => (
        <>
            <Widget header="Users" size="single">
                <p>Total: 1,234</p>
            </Widget>
            <Widget header="Revenue" size="single">
                <p>$45,678</p>
            </Widget>
            <Widget header="Detailed Analytics" size="double">
                <p>This widget spans two columns for more detailed information.</p>
            </Widget>
        </>
    ),
};

export const WithClassName: Story = {
    args: {
        header: "Custom Styled Widget",
        size: "single",
        className: "bg-primary text-white",
        children: (
            <p>This widget has custom styling applied.</p>
        ),
    },
};
