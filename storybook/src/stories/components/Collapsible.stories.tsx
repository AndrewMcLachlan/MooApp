import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible } from "@andrewmclachlan/moo-ds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const meta = {
    title: "Moo App/Components/Collapsible",
    component: Collapsible,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        header: {
            description: "Header content for the collapsible section",
        },
        open: {
            control: "boolean",
            description: "Whether the section is open by default",
        },
    },
    args: {
        header: "Click to expand",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        header: "Click to expand",
        headerAs: "h2",
        children: (
            <p>
                This is the collapsible content. It can contain any React elements
                including text, images, forms, or other components.
            </p>
        ),
    },
};

export const OpenByDefault: Story = {
    args: {
        header: "Already open section",
        open: true,
        children: (
            <p>
                This section is open by default. Click the header to collapse it.
            </p>
        ),
    },
};

export const WithRichHeader: Story = {
    args: {
        header: (
            <span>
                <FontAwesomeIcon icon="cog" style={{ marginRight: "8px" }} />
                Settings Section
            </span>
        ),
        children: (
            <div>
                <p>Settings content goes here.</p>
                <ul>
                    <li>Option 1</li>
                    <li>Option 2</li>
                    <li>Option 3</li>
                </ul>
            </div>
        ),
    },
};

export const NestedCollapsibles: Story = {
    render: () => (
        <Collapsible header="Parent Section">
            <p>This is the parent content.</p>
            <Collapsible header="Child Section 1">
                <p>Child 1 content</p>
            </Collapsible>
            <Collapsible header="Child Section 2">
                <p>Child 2 content</p>
                <Collapsible header="Grandchild Section">
                    <p>Deeply nested content</p>
                </Collapsible>
            </Collapsible>
        </Collapsible>
    ),
};

export const MultipleCollapsibles: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Collapsible header="Section 1">
                <p>Content for section 1</p>
            </Collapsible>
            <Collapsible header="Section 2">
                <p>Content for section 2</p>
            </Collapsible>
            <Collapsible header="Section 3">
                <p>Content for section 3</p>
            </Collapsible>
        </div>
    ),
};

export const WithFormContent: Story = {
    args: {
        header: "Additional Options",
        children: (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label>
                    <input type="checkbox" /> Enable notifications
                </label>
                <label>
                    <input type="checkbox" /> Auto-save
                </label>
                <label>
                    <input type="checkbox" /> Dark mode
                </label>
            </div>
        ),
    },
};
