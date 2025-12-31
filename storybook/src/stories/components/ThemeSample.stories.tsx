import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ThemeSample, Themes } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/ThemeSample",
    component: ThemeSample,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        theme: {
            description: "Theme object containing name, theme, and optional colour",
        },
        onClick: { action: "theme selected" },
    },
} satisfies Meta<typeof ThemeSample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const System: Story = {
    args: {
        theme: Themes[0], // System theme
        onClick: fn(),
    },
};

export const DarkWarm: Story = {
    args: {
        theme: Themes[1], // Dark warm theme
        onClick: fn(),
    },
};

export const DarkCool: Story = {
    args: {
        theme: Themes[2], // Dark cool theme
        onClick: fn(),
    },
};

export const Light: Story = {
    args: {
        theme: Themes[3], // Light theme
        onClick: fn(),
    },
};

export const Red: Story = {
    args: {
        theme: Themes[4], // Red theme
        onClick: fn(),
    },
};

export const AllThemes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {Themes.map((theme) => (
                <div key={theme.name} style={{ textAlign: "center" }}>
                    <ThemeSample theme={theme} onClick={fn()} />
                    <p style={{ marginTop: "8px", fontSize: "12px" }}>{theme.name}</p>
                </div>
            ))}
        </div>
    ),
};
