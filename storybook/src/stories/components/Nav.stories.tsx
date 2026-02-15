import type { Meta, StoryObj } from "@storybook/react-vite";
import { Nav } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Nav",
    component: Nav,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Nav>
            <Nav.Item><Nav.Link active>Active</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>Link</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>Link</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link disabled>Disabled</Nav.Link></Nav.Item>
        </Nav>
    ),
};

export const Pills: Story = {
    render: () => (
        <Nav variant="pills">
            <Nav.Item><Nav.Link active>Active</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>Link</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>Link</Nav.Link></Nav.Item>
        </Nav>
    ),
};

export const Column: Story = {
    render: () => (
        <Nav column style={{ width: "200px" }}>
            <Nav.Item><Nav.Link active>Dashboard</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>Settings</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link>Profile</Nav.Link></Nav.Item>
        </Nav>
    ),
};
