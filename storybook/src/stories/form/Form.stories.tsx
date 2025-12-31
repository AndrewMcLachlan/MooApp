import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Form } from "@andrewmclachlan/moo-ds";
import { useForm } from "react-hook-form";

const meta = {
    title: "Moo App/Form/Form",
    component: Form,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        layout: {
            control: "radio",
            options: ["vertical", "horizontal"],
            description: "Form layout direction",
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

interface BasicFormData {
    username: string;
    email: string;
    password: string;
}

export const VerticalLayout: Story = {
    render: function Render() {
        const form = useForm<BasicFormData>();
        return (
            <Form form={form} onSubmit={fn()} layout="vertical">
                <Form.Group groupId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Input type="email" />
                </Form.Group>
                <Form.Group groupId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Password />
                </Form.Group>
                <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
        );
    },
};

export const HorizontalLayout: Story = {
    render: function Render() {
        const form = useForm<BasicFormData>();
        return (
            <Form form={form} onSubmit={fn()} layout="horizontal">
                <Form.Group groupId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Input type="email" />
                </Form.Group>
                <Form.Group groupId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Password />
                </Form.Group>
                <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
        );
    },
};

interface AllInputsFormData {
    textInput: string;
    emailInput: string;
    passwordInput: string;
    selectInput: string;
    textareaInput: string;
    checkInput: boolean;
}

export const WithAllInputTypes: Story = {
    render: function Render() {
        const form = useForm<AllInputsFormData>();
        return (
            <Form form={form} onSubmit={fn()}>
                <Form.Group groupId="textInput">
                    <Form.Label>Text Input</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="emailInput">
                    <Form.Label>Email Input</Form.Label>
                    <Form.Input type="email" placeholder="email@example.com" />
                </Form.Group>
                <Form.Group groupId="passwordInput">
                    <Form.Label>Password Input</Form.Label>
                    <Form.Password />
                </Form.Group>
                <Form.Group groupId="selectInput">
                    <Form.Label>Select Input</Form.Label>
                    <Form.Select>
                        <option value="">Choose...</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group groupId="textareaInput">
                    <Form.Label>TextArea Input</Form.Label>
                    <Form.TextArea rows={3} />
                </Form.Group>
                <Form.Group groupId="checkInput">
                    <Form.Check label="I agree to the terms" />
                </Form.Group>
                <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
        );
    },
};

export const WithGroups: Story = {
    render: function Render() {
        const form = useForm();
        return (
            <Form form={form} onSubmit={fn()}>
                <fieldset>
                    <legend>Personal Information</legend>
                    <Form.Group groupId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Input />
                    </Form.Group>
                    <Form.Group groupId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Input />
                    </Form.Group>
                </fieldset>
                <fieldset>
                    <legend>Contact Information</legend>
                    <Form.Group groupId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Input type="email" />
                    </Form.Group>
                    <Form.Group groupId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Input type="tel" />
                    </Form.Group>
                </fieldset>
                <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
        );
    },
};

export const WithLabels: Story = {
    render: function Render() {
        const form = useForm();
        return (
            <Form form={form} onSubmit={fn()}>
                <Form.Group groupId="required">
                    <Form.Label>Required Field *</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="optional">
                    <Form.Label>Optional Field</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="withHint">
                    <Form.Label>Field with Hint</Form.Label>
                    <Form.Input />
                    <small className="text-muted">Enter at least 8 characters</small>
                </Form.Group>
                <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
        );
    },
};

export const SubmitHandling: Story = {
    render: function Render() {
        const form = useForm<{ name: string; email: string }>();

        const onSubmit = (data: { name: string; email: string }) => {
            alert(`Submitted: ${JSON.stringify(data)}`);
        };

        return (
            <Form form={form} onSubmit={onSubmit}>
                <Form.Group groupId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Input />
                </Form.Group>
                <Form.Group groupId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Input type="email" />
                </Form.Group>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={() => form.reset()}>Reset</button>
                </div>
            </Form>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Fill out the form and click Submit to see the form data.",
            },
        },
    },
};

export const CompactForm: Story = {
    render: function Render() {
        const form = useForm<{ search: string }>();
        return (
            <Form form={form} onSubmit={fn()} layout="horizontal">
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                    <Form.Group groupId="search">
                        <Form.Label>Search</Form.Label>
                        <Form.Input placeholder="Enter search term..." />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">Search</button>
                </div>
            </Form>
        );
    },
};
