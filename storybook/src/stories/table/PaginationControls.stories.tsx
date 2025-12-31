import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { PaginationControls, Pagination, PageSize } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Table/PaginationControls",
    component: PaginationControls,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof PaginationControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPaginationAndPageSize: Story = {
    render: () => (
        <PaginationControls>
            <Pagination pageNumber={1} numberOfPages={10} onChange={fn()} />
            <PageSize value={10} onChange={fn()} />
        </PaginationControls>
    ),
};

export const PaginationOnly: Story = {
    render: () => (
        <PaginationControls>
            <Pagination pageNumber={5} numberOfPages={20} onChange={fn()} />
        </PaginationControls>
    ),
};

export const PageSizeOnly: Story = {
    render: () => (
        <PaginationControls>
            <PageSize value={25} pageSizes={[10, 25, 50, 100]} onChange={fn()} />
        </PaginationControls>
    ),
};

export const Interactive: Story = {
    render: function Render() {
        const [{ pageNumber, pageSize }, updateArgs] = useArgs();

        const handlePageChange = (_current: number, newPage: number) => {
            updateArgs({ pageNumber: newPage });
        };

        const handlePageSizeChange = (newSize: number) => {
            updateArgs({ pageSize: newSize, pageNumber: 1 });
        };

        const totalItems = 250;
        const numberOfPages = Math.ceil(totalItems / pageSize);

        return (
            <div>
                <PaginationControls>
                    <Pagination
                        pageNumber={pageNumber}
                        numberOfPages={numberOfPages}
                        onChange={handlePageChange}
                    />
                    <PageSize
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    />
                </PaginationControls>
                <p style={{ marginTop: "8px", fontSize: "12px", textAlign: "center" }}>
                    Page {pageNumber} of {numberOfPages} ({totalItems} total items, {pageSize} per page)
                </p>
            </div>
        );
    },
    args: {
        pageNumber: 1,
        pageSize: 10,
    },
};

export const MiddlePageLargeDataset: Story = {
    render: () => (
        <PaginationControls>
            <Pagination pageNumber={25} numberOfPages={100} onChange={fn()} />
            <PageSize value={50} onChange={fn()} />
        </PaginationControls>
    ),
};
