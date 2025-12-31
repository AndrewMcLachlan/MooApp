import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { ComboBox } from "@andrewmclachlan/moo-ds";
import { sampleItems, SampleItem } from "../utils/mockData";

const meta = {
    title: "Moo App/Components/ComboBox",
    component: ComboBox,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        clearable: {
            control: "boolean",
            description: "Allow clearing all selected items",
        },
        creatable: {
            control: "boolean",
            description: "Allow creating new items",
        },
        multiSelect: {
            control: "boolean",
            description: "Allow selecting multiple items",
        },
        readonly: {
            control: "boolean",
            description: "Make the combobox read-only",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text",
        },
    },
    args: {
        items: sampleItems,
        labelField: (item: SampleItem) => item.name,
        valueField: (item: SampleItem) => item.id,
        placeholder: "Select...",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "300px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ComboBox<SampleItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
    args: {
        selectedItems: [],
        onChange: fn(),
    },
};

export const MultiSelect: Story = {
    args: {
        multiSelect: true,
        selectedItems: [],
        onChange: fn(),
    },
};

export const Clearable: Story = {
    args: {
        clearable: true,
        selectedItems: [sampleItems[0]],
        onChange: fn(),
    },
};

export const Creatable: Story = {
    args: {
        creatable: true,
        selectedItems: [],
        onCreate: fn(),
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Type a new value and press Enter to create a new item.",
            },
        },
    },
};

export const ClearableAndCreatable: Story = {
    args: {
        clearable: true,
        creatable: true,
        multiSelect: true,
        selectedItems: [sampleItems[0]],
        onCreate: fn(),
        onChange: fn(),
    },
};

export const WithColors: Story = {
    args: {
        multiSelect: true,
        selectedItems: [sampleItems[0], sampleItems[1]],
        colourField: (item: SampleItem) => item.color,
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Items can display with colored badges using the colourField prop.",
            },
        },
    },
};

export const WithPreselectedItems: Story = {
    args: {
        multiSelect: true,
        selectedItems: [sampleItems[0], sampleItems[2], sampleItems[4]],
        onChange: fn(),
    },
};

export const Readonly: Story = {
    args: {
        readonly: true,
        selectedItems: [sampleItems[1]],
    },
    parameters: {
        docs: {
            description: {
                story: "Read-only mode displays the selection without allowing changes.",
            },
        },
    },
};

export const Empty: Story = {
    args: {
        items: [],
        selectedItems: [],
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "ComboBox with no available items.",
            },
        },
    },
};

export const Controlled: Story = {
    render: function Render(args) {
        const [{ selectedItems }, updateArgs] = useArgs();

        const handleChange = (items: SampleItem[]) => {
            updateArgs({ selectedItems: items });
        };

        return (
            <div>
                <ComboBox<SampleItem>
                    {...args}
                    selectedItems={selectedItems || []}
                    onChange={handleChange}
                />
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                    Selected: {(selectedItems || []).map((i: SampleItem) => i.name).join(", ") || "None"}
                </p>
            </div>
        );
    },
    args: {
        multiSelect: true,
        clearable: true,
        selectedItems: [],
    },
};

export const WithCallbacks: Story = {
    args: {
        multiSelect: true,
        clearable: true,
        creatable: true,
        selectedItems: [],
        onAdd: fn(),
        onRemove: fn(),
        onChange: fn(),
        onCreate: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "All callback props (onAdd, onRemove, onChange, onCreate) are available in the Actions panel.",
            },
        },
    },
};

export const CustomPlaceholder: Story = {
    args: {
        placeholder: "Choose your favorite color...",
        selectedItems: [],
        onChange: fn(),
    },
};
