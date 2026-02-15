import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationBase } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

const meta = {
    title: "Moo App/Components/PaginationBase",
    component: PaginationBase,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof PaginationBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [page, setPage] = useState(3);
        const total = 10;
        return (
            <PaginationBase>
                <PaginationBase.First disabled={page === 1} onClick={() => setPage(1)} />
                <PaginationBase.Prev disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                {[1, 2, 3, 4, 5].map(p => (
                    <PaginationBase.Item key={p} active={p === page} onClick={() => setPage(p)}>{p}</PaginationBase.Item>
                ))}
                <PaginationBase.Next disabled={page === total} onClick={() => setPage(p => p + 1)} />
                <PaginationBase.Last disabled={page === total} onClick={() => setPage(total)} />
            </PaginationBase>
        );
    },
};
