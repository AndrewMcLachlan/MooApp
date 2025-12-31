import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionTable } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Layout/SectionTable",
    component: SectionTable,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        header: {
            control: "text",
            description: "Section header text or component",
        },
        headerSize: {
            control: "select",
            options: [1, 2, 3, 4, 5, 6],
            description: "Header element size (h1-h6)",
        },
        striped: {
            control: "boolean",
        },
        bordered: {
            control: "boolean",
        },
        hover: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof SectionTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTableContent = (
    <>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Active</td>
            </tr>
            <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>Inactive</td>
            </tr>
            <tr>
                <td>Bob Wilson</td>
                <td>bob@example.com</td>
                <td>Active</td>
            </tr>
        </tbody>
    </>
);

export const WithHeader: Story = {
    args: {
        header: "User List",
        striped: true,
        children: sampleTableContent,
    },
};

export const WithoutHeader: Story = {
    args: {
        striped: true,
        children: sampleTableContent,
    },
};

export const CustomHeaderSize: Story = {
    args: {
        header: "Small Header Table",
        headerSize: 5,
        bordered: true,
        children: sampleTableContent,
    },
};

export const FullyStyled: Story = {
    args: {
        header: "Styled Table",
        striped: true,
        bordered: true,
        hover: true,
        children: sampleTableContent,
    },
};

export const LargeDataset: Story = {
    args: {
        header: "Product Inventory",
        striped: true,
        hover: true,
        children: (
            <>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <tr key={i}>
                            <td>{i}</td>
                            <td>Product {i}</td>
                            <td>Category {(i % 3) + 1}</td>
                            <td>${(i * 10.99).toFixed(2)}</td>
                            <td>{i * 10}</td>
                        </tr>
                    ))}
                </tbody>
            </>
        ),
    },
};
