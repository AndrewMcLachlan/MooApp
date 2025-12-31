import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { SortableTh } from "@andrewmclachlan/moo-ds";
import { TableDecorator } from "../utils/decorators";

const meta = {
    title: "Moo App/Table/SortableTh",
    component: SortableTh,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        field: {
            control: "text",
            description: "Field identifier for this column",
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
        onSort: { action: "sorted" },
    },
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Ascending",
        children: "Name",
    },
    decorators: [TableDecorator],
} satisfies Meta<typeof SortableTh>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveAscending: Story = {
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Ascending",
        children: "Name",
        onSort: fn(),
    },
};

export const ActiveDescending: Story = {
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Descending",
        children: "Name",
        onSort: fn(),
    },
};

export const Inactive: Story = {
    args: {
        field: "name",
        sortField: "date",
        sortDirection: "Ascending",
        children: "Name",
        onSort: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "When field doesn't match sortField, the sort icon is hidden.",
            },
        },
    },
};

export const Interactive: Story = {
    render: function Render(args) {
        const [{ sortField, sortDirection }, updateArgs] = useArgs();

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

        return (
            <SortableTh
                {...args}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
            />
        );
    },
    args: {
        field: "name",
        sortField: "name",
        sortDirection: "Ascending",
        children: "Name (Click to toggle)",
    },
};

export const MultipleColumns: Story = {
    render: function Render() {
        const [{ sortField, sortDirection }, updateArgs] = useArgs();

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

        return (
            <>
                <SortableTh field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                    Name
                </SortableTh>
                <SortableTh field="date" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                    Date
                </SortableTh>
                <SortableTh field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                    Status
                </SortableTh>
            </>
        );
    },
    args: {
        sortField: "name",
        sortDirection: "Ascending",
    },
    decorators: [
        (Story) => (
            <div className="dark" data-bs-theme="dark">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <Story />
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John</td>
                            <td>2024-01-01</td>
                            <td>Active</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ),
    ],
};
