import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { ClearableInput } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/ClearableInput",
    component: ClearableInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        clearable: {
            control: "boolean",
            description: "Show clear button when input has value",
        },
        disabled: {
            control: "boolean",
        },
        placeholder: {
            control: "text",
        },
    },
    args: {
        clearable: true,
        placeholder: "Enter text...",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "300px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ClearableInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        clearable: false,
        className: "form-control",
    },
};

export const Clearable: Story = {
    args: {
        clearable: true,
        className: "form-control",
    },
};

export const WithValue: Story = {
    args: {
        clearable: true,
        defaultValue: "Some text to clear",
        className: "form-control",
    },
};

export const Disabled: Story = {
    args: {
        clearable: true,
        disabled: true,
        defaultValue: "Disabled input",
        className: "form-control",
    },
};

export const WithPlaceholder: Story = {
    args: {
        clearable: true,
        placeholder: "Type something here...",
    },
};

export const Controlled: Story = {
    render: function Render(args) {
        const [{ value }, updateArgs] = useArgs();

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            updateArgs({ value: e.target.value });
        };

        return (
            <div>
                <ClearableInput
                    {...args}
                    value={value || ""}
                    onChange={handleChange}
                />
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                    Current value: "{value || ""}"
                </p>
            </div>
        );
    },
    args: {
        clearable: true,
        value: "Initial value",
    },
};

export const DifferentTypes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <ClearableInput clearable type="text" placeholder="Text input" className="form-control" />
            <ClearableInput clearable type="email" placeholder="Email input" className="form-control" />
            <ClearableInput clearable type="password" placeholder="Password input" className="form-control" />
            <ClearableInput clearable type="number" placeholder="Number input" className="form-control" />
        </div>
    ),
};
