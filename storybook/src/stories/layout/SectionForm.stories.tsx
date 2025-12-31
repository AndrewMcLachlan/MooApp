import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SectionForm, Form } from "@andrewmclachlan/moo-ds";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const meta = {
    title: "Moo App/Layout/SectionForm",
    component: SectionForm,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        header: {
            control: "text",
            description: "Section header text or component",
        },
        headerSize: {
            control: "select",
            options: [1, 2, 3, 4, 5, 6],
            description: "Header element size (h1-h6)",
        },
        layout: {
            control: "radio",
            options: ["vertical", "horizontal"],
            description: "Form layout direction",
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: "600px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SectionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

interface UserFormData {
    name: string;
    email: string;
}

export const WithStringHeader: Story = {
    render: function Render() {
        const form = useForm<UserFormData>();
        return (
            <SectionForm form={form} onSubmit={fn()} header="User Settings">
                <Form.Group groupId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Input type="email" />
                </Form.Group>
                <button type="submit" className="btn btn-primary">Save</button>
            </SectionForm>
        );
    },
};

export const WithReactNodeHeader: Story = {
    render: function Render() {
        const form = useForm<UserFormData>();
        return (
            <SectionForm
                form={form}
                onSubmit={fn()}
                header={
                    <span>
                        <FontAwesomeIcon icon="cog" style={{ marginRight: "8px" }} />
                        Configuration
                    </span>
                }
            >
                <Form.Group groupId="name">
                    <Form.Label>Setting Name</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="email">
                    <Form.Label>Setting Value</Form.Label>
                    <Form.Input />
                </Form.Group>
                <button type="submit" className="btn btn-primary">Update</button>
            </SectionForm>
        );
    },
};

export const DifferentHeaderSizes: Story = {
    render: function Render() {
        const form2 = useForm();
        const form4 = useForm();
        const form6 = useForm();
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <SectionForm form={form2} onSubmit={fn()} header="Header Size 2" headerSize={2}>
                    <Form.Group groupId="field">
                        <Form.Label>Field</Form.Label>
                        <Form.Input />
                    </Form.Group>
                </SectionForm>
                <SectionForm form={form4} onSubmit={fn()} header="Header Size 4" headerSize={4}>
                    <Form.Group groupId="field">
                        <Form.Label>Field</Form.Label>
                        <Form.Input />
                    </Form.Group>
                </SectionForm>
                <SectionForm form={form6} onSubmit={fn()} header="Header Size 6" headerSize={6}>
                    <Form.Group groupId="field">
                        <Form.Label>Field</Form.Label>
                        <Form.Input />
                    </Form.Group>
                </SectionForm>
            </div>
        );
    },
};

interface CompleteFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    newsletter: boolean;
}

export const WithFormContent: Story = {
    render: function Render() {
        const form = useForm<CompleteFormData>();

        const onSubmit = (data: CompleteFormData) => {
            alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
        };

        return (
            <SectionForm form={form} onSubmit={onSubmit} header="Profile Settings">
                <Form.Group groupId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Input type="email" />
                </Form.Group>
                <Form.Group groupId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Input type="tel" />
                </Form.Group>
                <Form.Group groupId="bio">
                    <Form.Label>Bio</Form.Label>
                    <Form.TextArea rows={3} />
                </Form.Group>
                <Form.Group groupId="newsletter">
                    <Form.Check label="Subscribe to newsletter" />
                </Form.Group>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button type="submit" className="btn btn-primary">Save Profile</button>
                    <button type="button" className="btn btn-secondary" onClick={() => form.reset()}>Reset</button>
                </div>
            </SectionForm>
        );
    },
};

export const HorizontalLayout: Story = {
    render: function Render() {
        const form = useForm<UserFormData>();
        return (
            <SectionForm form={form} onSubmit={fn()} header="Horizontal Form" layout="horizontal">
                <Form.Group groupId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Input type="email" />
                </Form.Group>
                <button type="submit" className="btn btn-primary">Save</button>
            </SectionForm>
        );
    },
};
