import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingTableRow } from "@andrewmclachlan/moo-ds";
import { TableBodyDecorator } from "../utils/decorators";

const meta = {
    title: "Moo App/Table/LoadingTableRow",
    component: LoadingTableRow,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        cols: {
            control: { type: "number", min: 1, max: 10 },
            description: "Number of columns in the loading row",
        },
    },
    args: {
        cols: 3,
    },
    decorators: [TableBodyDecorator],
} satisfies Meta<typeof LoadingTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {
    args: {
        cols: 3,
    },
};

export const FiveColumns: Story = {
    args: {
        cols: 5,
    },
};

export const SingleColumn: Story = {
    args: {
        cols: 1,
    },
};

export const TenColumns: Story = {
    args: {
        cols: 10,
    },
};
