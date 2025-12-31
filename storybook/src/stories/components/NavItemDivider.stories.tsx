import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavItemDivider } from "@andrewmclachlan/moo-ds";
import { Nav } from "react-bootstrap";

const meta = {
    title: "Moo App/Components/NavItemDivider",
    component: NavItemDivider,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <Nav className="flex-column" style={{ width: "200px" }}>
                <Nav.Link>Item Above</Nav.Link>
                <Story />
                <Nav.Link>Item Below</Nav.Link>
            </Nav>
        ),
    ],
} satisfies Meta<typeof NavItemDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
