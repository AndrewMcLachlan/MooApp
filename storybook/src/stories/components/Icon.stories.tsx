import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Icon } from "@andrewmclachlan/moo-ds";
import { PieChart } from "@andrewmclachlan/moo-icons";

// Custom SVG component for demo
const CustomSvgIcon = ({ className, onClick, title }: { className?: string; onClick?: () => void; title?: string }) => (
    <svg
        className={className}
        onClick={onClick}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <title>{title}</title>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const meta = {
    title: "Moo App/Components/Icon",
    component: Icon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        onClick: { action: "clicked" },
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontAwesomeIcon: Story = {
    args: {
        icon: "home",
        title: "Home icon",
    },
};

export const MooIcon: Story = {
    args: {
        icon: PieChart,
        title: "Moo Icon component",
    },
};

export const CustomSVG: Story = {
    args: {
        icon: CustomSvgIcon,
        title: "Custom SVG icon",
    },
};

export const Clickable: Story = {
    args: {
        icon: "edit",
        title: "Click to edit",
        onClick: fn(),
    },
};

export const WithTitle: Story = {
    args: {
        icon: "info-circle",
        title: "Information",
    },
};

export const WithClassName: Story = {
    args: {
        icon: "star",
        title: "Favorite",
        className: "text-warning",
    },
};

export const DifferentIcons: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "16px" }}>
            <Icon icon="home" title="Home" />
            <Icon icon="user" title="User" />
            <Icon icon="cog" title="Settings" />
            <Icon icon="bell" title="Notifications" />
            <Icon icon="search" title="Search" />
        </div>
    ),
};
