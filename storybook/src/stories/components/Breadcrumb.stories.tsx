import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "@andrewmclachlan/moo-ds";
import { sampleBreadcrumbs, deepBreadcrumbs } from "../utils/mockData";

const meta = {
    title: "Moo App/Components/Breadcrumb",
    component: Breadcrumb,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        breadcrumbs: {
            description: "Array of navigation items to display as breadcrumbs",
        },
    },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        breadcrumbs: [],
    },
    parameters: {
        docs: {
            description: {
                story: "Shows only the Home breadcrumb when no additional items are provided.",
            },
        },
    },
};

export const WithBreadcrumbs: Story = {
    args: {
        breadcrumbs: sampleBreadcrumbs,
    },
};

export const DeepNesting: Story = {
    args: {
        breadcrumbs: deepBreadcrumbs,
    },
    parameters: {
        docs: {
            description: {
                story: "Demonstrates deeply nested navigation paths.",
            },
        },
    },
};

export const SingleLevel: Story = {
    args: {
        breadcrumbs: [
            { text: "Dashboard", route: "/dashboard" },
        ],
    },
};
