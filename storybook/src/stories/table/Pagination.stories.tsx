import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { Pagination } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Table/Pagination",
    component: Pagination,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        pageNumber: {
            control: { type: "number", min: 1 },
            description: "Current page number",
        },
        numberOfPages: {
            control: { type: "number", min: 1 },
            description: "Total number of pages",
        },
        onChange: { action: "page changed" },
    },
    args: {
        pageNumber: 1,
        numberOfPages: 10,
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
    args: {
        pageNumber: 1,
        numberOfPages: 10,
        onChange: fn(),
    },
};

export const MiddlePage: Story = {
    args: {
        pageNumber: 5,
        numberOfPages: 10,
        onChange: fn(),
    },
};

export const LastPage: Story = {
    args: {
        pageNumber: 10,
        numberOfPages: 10,
        onChange: fn(),
    },
};

export const ManyPages: Story = {
    args: {
        pageNumber: 15,
        numberOfPages: 50,
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Demonstrates page truncation with a large number of pages.",
            },
        },
    },
};

export const FewPages: Story = {
    args: {
        pageNumber: 2,
        numberOfPages: 3,
        onChange: fn(),
    },
};

export const SinglePage: Story = {
    args: {
        pageNumber: 1,
        numberOfPages: 1,
        onChange: fn(),
    },
};

export const Interactive: Story = {
    render: function Render(args) {
        const [{ pageNumber }, updateArgs] = useArgs();

        const handleChange = (_current: number, newPage: number) => {
            updateArgs({ pageNumber: newPage });
        };

        return (
            <div>
                <Pagination
                    {...args}
                    pageNumber={pageNumber}
                    onChange={handleChange}
                />
                <p style={{ marginTop: "8px", fontSize: "12px", textAlign: "center" }}>
                    Showing page {pageNumber} of {args.numberOfPages}
                </p>
            </div>
        );
    },
    args: {
        pageNumber: 1,
        numberOfPages: 20,
    },
};
