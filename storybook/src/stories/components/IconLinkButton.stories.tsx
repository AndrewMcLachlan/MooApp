import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconLinkButton } from "@andrewmclachlan/moo-ds";

// Custom SVG component for demo
const CustomSvgIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const meta = {
    title: "Moo App/Components/IconLinkButton",
    component: IconLinkButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        icon: {
            description: "FontAwesome icon or custom icon component",
        },
        iconSrc: {
            control: "text",
            description: "Image source for icon",
        },
        variant: {
            control: "select",
            options: ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "link", "outline-primary", "outline-secondary"],
            description: "Bootstrap button variant",
        },
        to: {
            control: "text",
            description: "Internal route destination",
        },
        href: {
            control: "text",
            description: "External link URL",
        },
    },
    args: {
        children: "Button Text",
    },
} satisfies Meta<typeof IconLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFontAwesomeIcon: Story = {
    args: {
        icon: "home",
        children: "Home",
        to: "/",
        variant: "primary",
    },
};

export const WithSVGIcon: Story = {
    args: {
        icon: CustomSvgIcon,
        children: "Custom Icon",
        to: "/custom",
        variant: "secondary",
    },
};

export const PrimaryVariant: Story = {
    args: {
        icon: "plus",
        children: "Add New",
        to: "/add",
        variant: "primary",
    },
};

export const SecondaryVariant: Story = {
    args: {
        icon: "edit",
        children: "Edit",
        to: "/edit",
        variant: "secondary",
    },
};

export const SuccessVariant: Story = {
    args: {
        icon: "check",
        children: "Confirm",
        to: "/confirm",
        variant: "success",
    },
};

export const DangerVariant: Story = {
    args: {
        icon: "trash",
        children: "Delete",
        to: "/delete",
        variant: "danger",
    },
};

export const OutlineVariant: Story = {
    args: {
        icon: "cog",
        children: "Settings",
        to: "/settings",
        variant: "outline-primary",
    },
};

export const WithInternalRoute: Story = {
    args: {
        icon: "user",
        children: "Profile",
        to: "/profile",
        variant: "primary",
    },
    parameters: {
        docs: {
            description: {
                story: "Use `to` prop for internal routes (works with LinkProvider).",
            },
        },
    },
};

export const WithExternalHref: Story = {
    args: {
        icon: "external-link-alt",
        children: "External Link",
        href: "https://example.com",
        variant: "link",
    },
    parameters: {
        docs: {
            description: {
                story: "Use `href` prop for external links.",
            },
        },
    },
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <IconLinkButton icon="home" to="/" variant="primary">Primary</IconLinkButton>
            <IconLinkButton icon="cog" to="/settings" variant="secondary">Secondary</IconLinkButton>
            <IconLinkButton icon="check" to="/confirm" variant="success">Success</IconLinkButton>
            <IconLinkButton icon="exclamation-triangle" to="/warning" variant="warning">Warning</IconLinkButton>
            <IconLinkButton icon="times" to="/cancel" variant="danger">Danger</IconLinkButton>
            <IconLinkButton icon="info-circle" to="/info" variant="info">Info</IconLinkButton>
        </div>
    ),
};
