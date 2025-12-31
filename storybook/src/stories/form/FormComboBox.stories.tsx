import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Form, FormComboBox } from "@andrewmclachlan/moo-ds";
import { useForm } from "react-hook-form";
import { sampleItems, SampleItem } from "../utils/mockData";

const meta = {
    title: "Moo App/Form/FormComboBox",
    component: FormComboBox,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        multiSelect: {
            control: "boolean",
            description: "Allow selecting multiple items",
        },
        clearable: {
            control: "boolean",
            description: "Allow clearing all selected items",
        },
        creatable: {
            control: "boolean",
            description: "Allow creating new items",
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FormComboBox<SampleItem>>;

export default meta;
type Story = StoryObj<typeof meta>;

interface SingleSelectFormData {
    color: number;
}

export const SingleSelect: Story = {
    render: function Render() {
        const form = useForm<SingleSelectFormData>();

        const onSubmit = (data: SingleSelectFormData) => {
            const selected = sampleItems.find(i => i.id === data.color);
            alert(`Selected: ${selected?.name || "None"}`);
        };

        return (
            <Form form={form} onSubmit={onSubmit}>
                <Form.Group groupId="color">
                    <Form.Label>Select a Color</Form.Label>
                    <FormComboBox<SampleItem>
                        items={sampleItems}
                        labelField={(item) => item.name}
                        valueField={(item) => item.id}
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </Form>
        );
    },
};

interface MultiSelectFormData {
    colors: number[];
}

export const MultiSelect: Story = {
    render: function Render() {
        const form = useForm<MultiSelectFormData>();

        const onSubmit = (data: MultiSelectFormData) => {
            const selected = sampleItems.filter(i => data.colors?.includes(i.id));
            alert(`Selected: ${selected.map(s => s.name).join(", ") || "None"}`);
        };

        return (
            <Form form={form} onSubmit={onSubmit}>
                <Form.Group groupId="colors">
                    <Form.Label>Select Colors (Multiple)</Form.Label>
                    <FormComboBox<SampleItem>
                        items={sampleItems}
                        labelField={(item) => item.name}
                        valueField={(item) => item.id}
                        multiSelect
                        clearable
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </Form>
        );
    },
};

export const WithFormValidation: Story = {
    render: function Render() {
        const form = useForm<SingleSelectFormData>({
            defaultValues: {
                color: undefined,
            },
        });

        const onSubmit = (data: SingleSelectFormData) => {
            if (!data.color) {
                alert("Please select a color!");
                return;
            }
            const selected = sampleItems.find(i => i.id === data.color);
            alert(`Selected: ${selected?.name}`);
        };

        return (
            <Form form={form} onSubmit={onSubmit}>
                <Form.Group groupId="color">
                    <Form.Label>Required Color Selection *</Form.Label>
                    <FormComboBox<SampleItem>
                        items={sampleItems}
                        labelField={(item) => item.name}
                        valueField={(item) => item.id}
                        placeholder="Please select a color..."
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </Form>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "FormComboBox can be used with react-hook-form validation.",
            },
        },
    },
};

export const InFormGroup: Story = {
    render: function Render() {
        const form = useForm<{ name: string; category: number; tags: number[] }>();

        const onSubmit = (data: { name: string; category: number; tags: number[] }) => {
            alert(`Form data: ${JSON.stringify(data)}`);
        };

        return (
            <Form form={form} onSubmit={onSubmit}>
                <Form.Group groupId="name">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="category">
                    <Form.Label>Category</Form.Label>
                    <FormComboBox<SampleItem>
                        items={sampleItems}
                        labelField={(item) => item.name}
                        valueField={(item) => item.id}
                        placeholder="Select category..."
                    />
                </Form.Group>
                <Form.Group groupId="tags">
                    <Form.Label>Tags</Form.Label>
                    <FormComboBox<SampleItem>
                        items={sampleItems}
                        labelField={(item) => item.name}
                        valueField={(item) => item.id}
                        colourField={(item) => item.color}
                        multiSelect
                        clearable
                        placeholder="Select tags..."
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-3">Save</button>
            </Form>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "FormComboBox integrates with Form.Group for consistent styling with other form elements.",
            },
        },
    },
};

export const WithColors: Story = {
    render: function Render() {
        const form = useForm<MultiSelectFormData>();

        return (
            <Form form={form} onSubmit={fn()}>
                <Form.Group groupId="colors">
                    <Form.Label>Select Colored Items</Form.Label>
                    <FormComboBox<SampleItem>
                        items={sampleItems}
                        labelField={(item) => item.name}
                        valueField={(item) => item.id}
                        colourField={(item) => item.color}
                        multiSelect
                        clearable
                    />
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </Form>
        );
    },
};
