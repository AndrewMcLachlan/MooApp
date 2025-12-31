import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { TagPanel } from "@andrewmclachlan/moo-ds";
import { sampleItems, SampleItem } from "../utils/mockData";

const meta = {
    title: "Moo App/Components/TagPanel",
    component: TagPanel,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        creatable: {
            control: "boolean",
            description: "Allow creating new tags",
        },
        alwaysShowEditPanel: {
            control: "boolean",
            description: "Always show the edit controls",
        },
        readonly: {
            control: "boolean",
            description: "Make the panel read-only",
        },
    },
    args: {
        items: sampleItems,
        labelField: (item: SampleItem) => item.name,
        valueField: (item: SampleItem) => item.id,
    },
    decorators: [
        (Story) => (
            <div style={{ width: "400px", minHeight: "100px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof TagPanel<SampleItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        selectedItems: [],
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Click on the panel to enter edit mode and select tags.",
            },
        },
    },
};

export const WithTags: Story = {
    args: {
        selectedItems: [sampleItems[0], sampleItems[2]],
        onChange: fn(),
    },
};

export const Creatable: Story = {
    args: {
        creatable: true,
        selectedItems: [sampleItems[0]],
        onCreate: fn(),
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Type a new value and press Enter to create a new tag.",
            },
        },
    },
};

export const Readonly: Story = {
    args: {
        readonly: true,
        selectedItems: [sampleItems[0], sampleItems[1], sampleItems[2]],
    },
    parameters: {
        docs: {
            description: {
                story: "Read-only mode displays tags without allowing changes.",
            },
        },
    },
};

export const AlwaysShowEditPanel: Story = {
    args: {
        alwaysShowEditPanel: true,
        selectedItems: [sampleItems[0]],
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Edit controls are always visible, no click required.",
            },
        },
    },
};

export const WithColors: Story = {
    args: {
        selectedItems: [sampleItems[0], sampleItems[1], sampleItems[2]],
        colourField: (item: SampleItem) => item.color,
        onChange: fn(),
        labelField: (item: SampleItem) => item.name,
        valueField: (item: SampleItem) => item.id,
    },
    parameters: {
        docs: {
            description: {
                story: "Tags display with colored backgrounds using the colourField prop.",
            },
        },
    },
};

export const Interactive: Story = {
    render: function Render(args) {
        const [{ selectedItems }, updateArgs] = useArgs();

        const handleChange = (items: SampleItem[]) => {
            updateArgs({ selectedItems: items });
        };

        const handleCreate = (text: string) => {
            const newItem: SampleItem = {
                id: Date.now(),
                name: text,
                color: "#888888",
            };
            updateArgs({
                selectedItems: [...(selectedItems || []), newItem],
            });
        };

        return (
            <div>
                <TagPanel<SampleItem>
                    {...args}
                    selectedItems={selectedItems || []}
                    onChange={handleChange}
                    onCreate={handleCreate}
                />
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                    Selected tags: {(selectedItems || []).map((i: SampleItem) => i.name).join(", ") || "None"}
                </p>
            </div>
        );
    },
    args: {
        creatable: true,
        alwaysShowEditPanel: true,
        selectedItems: [],
        colourField: (item: SampleItem) => item.color,
    },
};

export const WithCallbacks: Story = {
    args: {
        creatable: true,
        selectedItems: [sampleItems[0]],
        onAdd: fn(),
        onRemove: fn(),
        onChange: fn(),
        onCreate: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "All callback props are available in the Actions panel.",
            },
        },
    },
};

export const EmptyState: Story = {
    args: {
        selectedItems: [],
        alwaysShowEditPanel: true,
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Empty tag panel ready for selection.",
            },
        },
    },
};
