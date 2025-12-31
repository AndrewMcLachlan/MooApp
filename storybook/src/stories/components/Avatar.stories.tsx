import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@andrewmclachlan/moo-ds";
import { sampleAvatarUrl } from "../utils/mockData";

const meta = {
    title: "Moo App/Components/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        photo: {
            control: "text",
            description: "URL of the avatar image",
        },
        name: {
            control: "text",
            description: "User name for generating initials",
        },
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPhoto: Story = {
    args: {
        photo: sampleAvatarUrl,
    },
};

export const WithName: Story = {
    args: {
        name: "John Doe",
    },
};

export const WithBothPhotoAndName: Story = {
    args: {
        photo: sampleAvatarUrl,
        name: "John Doe",
    },
    parameters: {
        docs: {
            description: {
                story: "When both photo and name are provided, the photo takes precedence.",
            },
        },
    },
};

export const NoPhotoOrName: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: "Empty avatar when no photo or name is provided.",
            },
        },
    },
};

export const LongName: Story = {
    args: {
        name: "Jean-Claude Van Damme",
    },
    parameters: {
        docs: {
            description: {
                story: "Initials are generated from each word in the name.",
            },
        },
    },
};

export const SingleName: Story = {
    args: {
        name: "Admin",
    },
};

export const MultipleAvatars: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "16px" }}>
            <Avatar photo={sampleAvatarUrl} />
            <Avatar name="John Doe" />
            <Avatar name="Jane Smith" />
            <Avatar name="Bob" />
        </div>
    ),
};
