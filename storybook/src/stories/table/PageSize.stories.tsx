import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { PageSize } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Table/PageSize",
    component: PageSize,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        id: {
            control: "text",
            description: "HTML id for the select element",
        },
        pageSizes: {
            control: "object",
            description: "Array of available page sizes",
        },
        value: {
            control: "number",
            description: "Currently selected page size",
        },
        onChange: { action: "size changed" },
    },
    args: {
        id: "page-size",
        pageSizes: [10, 20, 50, 100],
        value: 10,
    },
} satisfies Meta<typeof PageSize>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 10,
        onChange: fn(),
    },
};

export const CustomPageSizes: Story = {
    args: {
        pageSizes: [5, 10, 25, 50],
        value: 5,
        onChange: fn(),
    },
};

export const LargePageSizes: Story = {
    args: {
        pageSizes: [25, 50, 100, 250, 500],
        value: 100,
        onChange: fn(),
    },
};

export const SelectedValue: Story = {
    args: {
        value: 50,
        onChange: fn(),
    },
};

export const Interactive: Story = {
    render: function Render(args) {
        const [{ value }, updateArgs] = useArgs();

        const handleChange = (newValue: number) => {
            updateArgs({ value: newValue });
        };

        return (
            <div>
                <PageSize
                    {...args}
                    value={value}
                    onChange={handleChange}
                />
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                    Showing {value} items per page
                </p>
            </div>
        );
    },
    args: {
        value: 10,
        pageSizes: [10, 20, 50, 100],
    },
};
