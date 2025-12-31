import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { SortablePaginationTh } from "@andrewmclachlan/moo-ds";
import { TableDecorator } from "../utils/decorators";

const meta = {
    title: "Moo App/Table/SortablePaginationTh",
    component: SortablePaginationTh,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        field: {
            control: "text",
            description: "Field identifier for sorting",
        },
        sortField: {
            control: "text",
            description: "Currently sorted field",
        },
        sortDirection: {
            control: "radio",
            options: ["Ascending", "Descending"],
            description: "Current sort direction",
        },
        pageNumber: {
            control: { type: "number", min: 1 },
            description: "Current page number",
        },
        numberOfPages: {
            control: { type: "number", min: 1 },
            description: "Total number of pages",
        },
        onSort: { action: "sorted" },
        onChange: { action: "page changed" },
    },
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Ascending",
        pageNumber: 1,
        numberOfPages: 10,
        children: "Name",
    },
    decorators: [TableDecorator],
} satisfies Meta<typeof SortablePaginationTh>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveAscendingFirstPage: Story = {
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Ascending",
        pageNumber: 1,
        numberOfPages: 10,
        children: "Name",
        onSort: fn(),
        onChange: fn(),
    },
};

export const ActiveDescendingMiddlePage: Story = {
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Descending",
        pageNumber: 5,
        numberOfPages: 10,
        children: "Name",
        onSort: fn(),
        onChange: fn(),
    },
};

export const InactiveSorting: Story = {
    args: {
        field: "name",
        sortField: "date",
        sortDirection: "Ascending",
        pageNumber: 3,
        numberOfPages: 10,
        children: "Name",
        onSort: fn(),
        onChange: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Sort icon is hidden when this column is not the active sort field.",
            },
        },
    },
};

export const Interactive: Story = {
    render: function Render(args) {
        const [{ sortField, sortDirection, pageNumber }, updateArgs] = useArgs();

        const handleSort = (field: string) => {
            if (field === sortField) {
                updateArgs({
                    sortDirection: sortDirection === "Ascending" ? "Descending" : "Ascending",
                });
            } else {
                updateArgs({
                    sortField: field,
                    sortDirection: "Ascending",
                });
            }
        };

        const handlePageChange = (_current: number, newPage: number) => {
            updateArgs({ pageNumber: newPage });
        };

        return (
            <SortablePaginationTh
                {...args}
                sortField={sortField}
                sortDirection={sortDirection}
                pageNumber={pageNumber}
                onSort={handleSort}
                onChange={handlePageChange}
            >
                Name (Click header to sort, arrows to paginate)
            </SortablePaginationTh>
        );
    },
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Ascending",
        pageNumber: 1,
        numberOfPages: 10,
    },
};
