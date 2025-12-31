import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { PaginationTh } from "@andrewmclachlan/moo-ds";
import { TableDecorator } from "../utils/decorators";

const meta = {
    title: "Moo App/Table/PaginationTh",
    component: PaginationTh,
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
        children: "Column Header",
    },
    decorators: [TableDecorator],
} satisfies Meta<typeof PaginationTh>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
    args: {
        pageNumber: 1,
        numberOfPages: 10,
        children: "Results",
        onChange: fn(),
    },
};

export const MiddlePage: Story = {
    args: {
        pageNumber: 5,
        numberOfPages: 10,
        children: "Results",
        onChange: fn(),
    },
};

export const LastPage: Story = {
    args: {
        pageNumber: 10,
        numberOfPages: 10,
        children: "Results",
        onChange: fn(),
    },
};

export const SinglePage: Story = {
    args: {
        pageNumber: 1,
        numberOfPages: 1,
        children: "Results",
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "When there's only one page, pagination controls are disabled.",
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
            <PaginationTh
                {...args}
                pageNumber={pageNumber}
                onChange={handleChange}
            >
                Page {pageNumber} of {args.numberOfPages}
            </PaginationTh>
        );
    },
    args: {
        pageNumber: 1,
        numberOfPages: 10,
    },
};
