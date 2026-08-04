import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, type ReactElement } from "react";
import { Badge } from "@andrewmclachlan/moo-ds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const meta = {
    title: "Moo App/Components/Badge",
    component: Badge,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Swap the global Storybook `.dark` body class for `.light` while the story is
 * mounted. The preview-level decorator sets `dark` on every story, so without
 * this the "Light mode contrast" story would still render under dark-mode rules.
 */
const ForceLightTheme = (Story: () => ReactElement) => {
    useEffect(() => {
        const body = document.body;
        const prevClasses = body.className;
        const prevTheme = body.getAttribute("data-theme");
        body.classList.remove("dark");
        body.classList.add("light");
        body.setAttribute("data-theme", "light");
        return () => {
            body.className = prevClasses;
            if (prevTheme) {
                body.setAttribute("data-theme", prevTheme);
            } else {
                body.removeAttribute("data-theme");
            }
        };
    }, []);
    return <Story />;
};

const semantics = ["primary", "secondary", "success", "danger", "warning", "info"] as const;
const hues = [
    "blue", "indigo", "purple", "pink", "rose",
    "orange", "amber", "yellow",
    "green", "emerald", "teal", "cyan",
    "slate", "neutral",
] as const;

export const Default: Story = {
    render: () => <Badge>Badge</Badge>,
};

export const Semantic: Story = {
    render: () => (
        <div className="demo-row tight">
            {semantics.map((bg) => (
                <Badge key={bg} bg={bg}>{bg}</Badge>
            ))}
        </div>
    ),
};

export const AllHuesSolid: Story = {
    name: "All hues — solid",
    render: () => (
        <div className="demo-row tight">
            {hues.map((bg) => (
                <Badge key={bg} bg={bg}>{bg}</Badge>
            ))}
        </div>
    ),
};

export const AllHuesMuted: Story = {
    name: "All hues — muted",
    render: () => (
        <div className="demo-row tight">
            {hues.map((bg) => (
                <Badge key={bg} bg={bg} muted>{bg}</Badge>
            ))}
        </div>
    ),
};

export const AllHuesOutline: Story = {
    name: "All hues — outline",
    render: () => (
        <div className="demo-row tight">
            {hues.map((bg) => (
                <Badge key={bg} bg={bg} outline>{bg}</Badge>
            ))}
        </div>
    ),
};

export const LightModeContrast: Story = {
    name: "Light mode contrast",
    decorators: [ForceLightTheme],
    render: () => (
        <div className="demo-col tight">
            <div className="demo-row tight">{hues.map((bg) => <Badge key={`s-${bg}`} bg={bg}>{bg}</Badge>)}</div>
            <div className="demo-row tight">{hues.map((bg) => <Badge key={`m-${bg}`} bg={bg} muted>{bg}</Badge>)}</div>
            <div className="demo-row tight">{hues.map((bg) => <Badge key={`o-${bg}`} bg={bg} outline>{bg}</Badge>)}</div>
        </div>
    ),
};

export const Pills: Story = {
    render: () => (
        <div className="demo-col tight">
            <div className="demo-row tight">{hues.map((bg) => <Badge key={bg} bg={bg} pill>{bg}</Badge>)}</div>
            <div className="demo-row tight">{hues.map((bg) => <Badge key={bg} bg={bg} pill muted>{bg}</Badge>)}</div>
            <div className="demo-row tight">{hues.map((bg) => <Badge key={bg} bg={bg} pill outline>{bg}</Badge>)}</div>
        </div>
    ),
};

export const CustomColour: Story = {
    name: "Custom colour",
    render: () => (
        <div className="demo-col tight">
            <div className="demo-row tight">
                <Badge colour="#7c6cff">Hex</Badge>
                <Badge colour="rgb(255, 99, 132)">RGB</Badge>
                <Badge colour="hsl(160, 70%, 45%)">HSL</Badge>
                <Badge colour="var(--primary)">CSS var</Badge>
                <Badge colour="#fde68a" textColour="#78350f">Light bg, dark text</Badge>
            </div>
            <div className="demo-row tight">
                <Badge colour="#7c6cff" muted>Muted</Badge>
                <Badge colour="#7c6cff" outline>Outline</Badge>
                <Badge colour="#7c6cff" pill>Pill</Badge>
            </div>
        </div>
    ),
};

export const WithIcon: Story = {
    name: "With icon",
    render: () => (
        <div className="demo-col tight">
            <div className="demo-row tight">
                <Badge bg="primary" icon={<FontAwesomeIcon icon="star" />}>Featured</Badge>
                <Badge bg="success" icon={<FontAwesomeIcon icon="check" />}>Done</Badge>
                <Badge bg="danger" icon={<FontAwesomeIcon icon="circle-xmark" />}>Failed</Badge>
                <Badge bg="warning" icon={<FontAwesomeIcon icon="triangle-exclamation" />}>Warning</Badge>
            </div>
            <div className="demo-row tight">
                <Badge bg="indigo" muted icon={<FontAwesomeIcon icon="bolt" />}>Muted</Badge>
                <Badge bg="teal" outline icon={<FontAwesomeIcon icon="leaf" />}>Outline</Badge>
                <Badge bg="rose" pill icon={<FontAwesomeIcon icon="heart" />}>Pill</Badge>
            </div>
        </div>
    ),
};

export const Composition: Story = {
    render: () => (
        <div className="demo-col tight">
            <div className="demo-row tight">
                <Badge bg="purple" muted pill icon={<FontAwesomeIcon icon="user" />}>muted + pill + icon</Badge>
                <Badge bg="emerald" outline pill icon={<FontAwesomeIcon icon="check" />}>outline + pill</Badge>
                <Badge colour="#7c6cff" muted icon={<FontAwesomeIcon icon="bolt" />}>custom + muted + icon</Badge>
            </div>
        </div>
    ),
};
