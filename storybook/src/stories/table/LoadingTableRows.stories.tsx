import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingTableRows } from "@andrewmclachlan/moo-ds";
import { TableBodyDecorator } from "../utils/decorators";

const meta = {
    title: "Moo App/Table/LoadingTableRows",
    component: LoadingTableRows,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        rows: {
            control: { type: "number", min: 1, max: 20 },
            description: "Number of rows to display",
        },
        cols: {
            control: { type: "number", min: 1, max: 10 },
            description: "Number of columns per row",
        },
    },
    args: {
        rows: 3,
        cols: 3,
    },
    decorators: [TableBodyDecorator],
} satisfies Meta<typeof LoadingTableRows>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeByThree: Story = {
    args: {
        rows: 3,
        cols: 3,
    },
};

export const TenRows: Story = {
    args: {
        rows: 10,
        cols: 5,
    },
};

export const SingleRow: Story = {
    args: {
        rows: 1,
        cols: 3,
    },
};

export const LargeGrid: Story = {
    args: {
        rows: 5,
        cols: 8,
    },
};
