import type { Meta, StoryObj } from "@storybook/react-vite";
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

const semantics = ["primary", "secondary", "success", "danger", "warning", "info"] as const;
const hues = [
    "blue", "indigo", "purple", "pink", "rose",
    "orange", "amber", "yellow",
    "green", "emerald", "teal", "cyan",
    "slate", "neutral",
] as const;

const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" };
const stack: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.25rem" };

export const Default: Story = {
    render: () => <Badge>Badge</Badge>,
};

export const Semantic: Story = {
    render: () => (
        <div style={row}>
            {semantics.map((bg) => (
                <Badge key={bg} bg={bg}>{bg}</Badge>
            ))}
        </div>
    ),
};

export const AllHuesSolid: Story = {
    name: "All hues — solid",
    render: () => (
        <div style={row}>
            {hues.map((bg) => (
                <Badge key={bg} bg={bg}>{bg}</Badge>
            ))}
        </div>
    ),
};

export const AllHuesMuted: Story = {
    name: "All hues — muted",
    render: () => (
        <div style={row}>
            {hues.map((bg) => (
                <Badge key={bg} bg={bg} muted>{bg}</Badge>
            ))}
        </div>
    ),
};

export const AllHuesOutline: Story = {
    name: "All hues — outline",
    render: () => (
        <div style={row}>
            {hues.map((bg) => (
                <Badge key={bg} bg={bg} outline>{bg}</Badge>
            ))}
        </div>
    ),
};

export const LightModeContrast: Story = {
    name: "Light mode contrast",
    render: () => (
        <div className="light" data-theme="light" style={{ background: "#fff", padding: "1rem", ...stack }}>
            <div style={row}>{hues.map((bg) => <Badge key={`s-${bg}`} bg={bg}>{bg}</Badge>)}</div>
            <div style={row}>{hues.map((bg) => <Badge key={`m-${bg}`} bg={bg} muted>{bg}</Badge>)}</div>
            <div style={row}>{hues.map((bg) => <Badge key={`o-${bg}`} bg={bg} outline>{bg}</Badge>)}</div>
        </div>
    ),
};

export const Pills: Story = {
    render: () => (
        <div style={stack}>
            <div style={row}>{hues.map((bg) => <Badge key={bg} bg={bg} pill>{bg}</Badge>)}</div>
            <div style={row}>{hues.map((bg) => <Badge key={bg} bg={bg} pill muted>{bg}</Badge>)}</div>
            <div style={row}>{hues.map((bg) => <Badge key={bg} bg={bg} pill outline>{bg}</Badge>)}</div>
        </div>
    ),
};

export const CustomColour: Story = {
    name: "Custom colour",
    render: () => (
        <div style={stack}>
            <div style={row}>
                <Badge colour="#7c6cff">Hex</Badge>
                <Badge colour="rgb(255, 99, 132)">RGB</Badge>
                <Badge colour="hsl(160, 70%, 45%)">HSL</Badge>
                <Badge colour="var(--primary)">CSS var</Badge>
                <Badge colour="#fde68a" textColour="#78350f">Light bg, dark text</Badge>
            </div>
            <div style={row}>
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
        <div style={stack}>
            <div style={row}>
                <Badge bg="primary" icon={<FontAwesomeIcon icon="star" />}>Featured</Badge>
                <Badge bg="success" icon={<FontAwesomeIcon icon="check" />}>Done</Badge>
                <Badge bg="danger" icon={<FontAwesomeIcon icon="circle-xmark" />}>Failed</Badge>
                <Badge bg="warning" icon={<FontAwesomeIcon icon="triangle-exclamation" />}>Warning</Badge>
            </div>
            <div style={row}>
                <Badge bg="indigo" muted icon={<FontAwesomeIcon icon="bolt" />}>Muted</Badge>
                <Badge bg="teal" outline icon={<FontAwesomeIcon icon="leaf" />}>Outline</Badge>
                <Badge bg="rose" pill icon={<FontAwesomeIcon icon="heart" />}>Pill</Badge>
            </div>
        </div>
    ),
};

export const Composition: Story = {
    render: () => (
        <div style={stack}>
            <div style={row}>
                <Badge bg="purple" muted pill icon={<FontAwesomeIcon icon="user" />}>muted + pill + icon</Badge>
                <Badge bg="emerald" outline pill icon={<FontAwesomeIcon icon="check" />}>outline + pill</Badge>
                <Badge colour="#7c6cff" muted icon={<FontAwesomeIcon icon="bolt" />}>custom + muted + icon</Badge>
            </div>
        </div>
    ),
};
