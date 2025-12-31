import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { SearchBox } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/SearchBox",
    component: SearchBox,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        value: {
            control: "text",
            description: "Current search value",
        },
        onChange: { action: "changed" },
    },
    args: {
        value: "",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "300px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof SearchBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        value: "",
        onChange: fn(),
    },
};

export const WithValue: Story = {
    args: {
        value: "search term",
        onChange: fn(),
    },
};

export const Controlled: Story = {
    render: function Render(args) {
        const [{ value }, updateArgs] = useArgs();

        const handleChange = (newValue: string) => {
            updateArgs({ value: newValue });
        };

        return (
            <div>
                <SearchBox
                    {...args}
                    value={value || ""}
                    onChange={handleChange}
                />
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                    Searching for: "{value || ""}"
                </p>
            </div>
        );
    },
    args: {
        value: "",
    },
};
