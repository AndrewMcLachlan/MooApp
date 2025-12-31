import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { NavItemList, NavItemDivider } from "@andrewmclachlan/moo-ds";
import { sampleNavItems, navItemsWithClick, navItemsWithImages } from "../utils/mockData";
import { Nav } from "react-bootstrap";

const meta = {
    title: "Moo App/Components/NavItemList",
    component: NavItemList,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        navItems: {
            description: "Array of navigation items or React nodes",
        },
        as: {
            description: "Wrapper element type for each nav item",
        },
        role: {
            control: "text",
            description: "ARIA role for nav items",
        },
        onClick: { action: "clicked" },
    },
    decorators: [
        (Story) => (
            <Nav className="flex-column" style={{ width: "200px" }}>
                <Story />
            </Nav>
        ),
    ],
} satisfies Meta<typeof NavItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRoutes: Story = {
    args: {
        navItems: sampleNavItems,
    },
};

export const WithOnClick: Story = {
    args: {
        navItems: navItemsWithClick,
        onClick: fn(),
    },
};

export const WithImages: Story = {
    args: {
        navItems: navItemsWithImages,
    },
};

export const MixedItems: Story = {
    args: {
        navItems: [
            { id: "1", text: "Home", route: "/" },
            { id: "2", text: "Click Action", onClick: () => console.log("Clicked!") },
            { id: "3", text: "Settings", route: "/settings" },
        ],
        onClick: fn(),
    },
    parameters: {
        docs: {
            description: {
                story: "Navigation items can mix route-based and click-based items.",
            },
        },
    },
};

export const WithCustomWrapper: Story = {
    args: {
        navItems: sampleNavItems,
        as: Nav.Item,
    },
    parameters: {
        docs: {
            description: {
                story: "Using Nav.Item as wrapper element for each item.",
            },
        },
    },
};

export const WithDividers: Story = {
    render: () => (
        <>
            <NavItemList navItems={[
                { id: "1", text: "Home", route: "/" },
                { id: "2", text: "Dashboard", route: "/dashboard" },
            ]} />
            <NavItemDivider />
            <NavItemList navItems={[
                { id: "3", text: "Settings", route: "/settings" },
                { id: "4", text: "Profile", route: "/profile" },
            ]} />
        </>
    ),
    parameters: {
        docs: {
            description: {
                story: "NavItemDivider can be used to separate groups of navigation items.",
            },
        },
    },
};

export const WithReactNodes: Story = {
    args: {
        navItems: [
            { id: "1", text: "Home", route: "/" },
            <Nav.Item key="custom" className="text-muted px-3 py-2">Custom Element</Nav.Item>,
            { id: "2", text: "Settings", route: "/settings" },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: "React nodes can be mixed with NavItem objects.",
            },
        },
    },
};
