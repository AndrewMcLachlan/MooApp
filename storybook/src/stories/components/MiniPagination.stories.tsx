import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { MiniPagination } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/MiniPagination",
    component: MiniPagination,
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
} satisfies Meta<typeof MiniPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
    args: {
        pageNumber: 1,
        numberOfPages: 10,
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Previous button is disabled on the first page.",
            },
        },
    },
};

export const MiddlePage: Story = {
    args: {
        pageNumber: 5,
        numberOfPages: 10,
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Both navigation buttons are enabled on middle pages.",
            },
        },
    },
};

export const LastPage: Story = {
    args: {
        pageNumber: 10,
        numberOfPages: 10,
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Next button is disabled on the last page.",
            },
        },
    },
};

export const SinglePage: Story = {
    args: {
        pageNumber: 1,
        numberOfPages: 1,
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Both buttons are disabled when there's only one page.",
            },
        },
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
                <MiniPagination
                    {...args}
                    pageNumber={pageNumber}
                    onChange={handleChange}
                />
                <p style={{ marginTop: "8px", fontSize: "12px", textAlign: "center" }}>
                    Page {pageNumber} of {args.numberOfPages}
                </p>
            </div>
        );
    },
    args: {
        pageNumber: 1,
        numberOfPages: 10,
    },
};
