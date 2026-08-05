import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kpi, Skeleton } from "@andrewmclachlan/moo-ds";

const meta = {
    title: "Moo App/Components/Kpi",
    component: Kpi,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Kpi>;

export default meta;
type Story = StoryObj<typeof meta>;

const strip: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" };

/** With no tone the bar takes the theme's primary colour and the figure inherits. */
export const Default: Story = {
    args: { label: "Balance" },
    render: (args) => (
        <Kpi {...args}>
            <Kpi.Value>$12,480.55</Kpi.Value>
            <Kpi.Sub>as at today</Kpi.Sub>
        </Kpi>
    ),
};

/** `tone` takes the same semantic tokens a Badge does, and colours the bar and the figure. */
export const Semantics: Story = {
    args: { label: "Semantics" },
    render: () => (
        <div style={strip}>
            {(["primary", "secondary", "success", "danger", "warning", "info"] as const).map(tone => (
                <Kpi key={tone} label={tone} tone={tone}>
                    <Kpi.Value>$8,200.00</Kpi.Value>
                    <Kpi.Sub>this month</Kpi.Sub>
                </Kpi>
            ))}
        </div>
    ),
};

/** The hue tokens are available too, for categories that aren't good or bad. */
export const Hues: Story = {
    args: { label: "Hues" },
    render: () => (
        <div style={strip}>
            {(["blue", "indigo", "purple", "pink", "rose", "orange", "amber", "yellow", "green", "emerald", "teal", "cyan", "slate", "neutral"] as const).map(tone => (
                <Kpi key={tone} label={tone} tone={tone}>
                    <Kpi.Value>184</Kpi.Value>
                </Kpi>
            ))}
        </div>
    ),
};

/**
 * The intended way to add a colour: declare a `--hue-*` token in CSS with `light-dark()`, add it
 * to the registry so it type-checks, and name it. No colour values in the component call, and
 * both schemes handled in one place.
 *
 * ```ts
 * declare module "@andrewmclachlan/moo-ds" {
 *     interface HueRegistry { income: true; expense: true; }
 * }
 * ```
 */
export const AppDefinedTokens: Story = {
    args: { label: "App tokens" },
    render: () => (
        <div className="kpi-story-tokens" style={strip}>
            <style>{`
                .kpi-story-tokens {
                    --hue-income:  light-dark(#3e9156, #6cc67e);
                    --hue-expense: light-dark(#a4332d, #e07b7b);
                }
            `}</style>
            <Kpi label="Income" tone={"income" as never}>
                <Kpi.Value>$8,200.00</Kpi.Value>
                <Kpi.Sub>this month</Kpi.Sub>
            </Kpi>
            <Kpi label="Expenses" tone={"expense" as never}>
                <Kpi.Value>$6,431.90</Kpi.Value>
                <Kpi.Sub>this month</Kpi.Sub>
            </Kpi>
        </div>
    ),
};

/**
 * `colour` and `textColour` are the escape hatch for a one-off with no token, and can be set
 * independently — a bar in one step of a hue and a figure in another.
 */
export const ExplicitColours: Story = {
    args: { label: "Explicit" },
    render: () => (
        <div style={strip}>
            <Kpi label="Bar and figure" colour="var(--hue-indigo)" textColour="var(--hue-purple)">
                <Kpi.Value>$8,200.00</Kpi.Value>
                <Kpi.Sub>two tokens, one card</Kpi.Sub>
            </Kpi>
            <Kpi label="Bar only" colour="var(--hue-teal)">
                <Kpi.Value>$1,768.10</Kpi.Value>
                <Kpi.Sub>figure keeps its own colour</Kpi.Sub>
            </Kpi>
            <Kpi label="Tone, figure overridden" tone="success" textColour="var(--body-colour-bold)">
                <Kpi.Value>$6,431.90</Kpi.Value>
                <Kpi.Sub>bar from the tone</Kpi.Sub>
            </Kpi>
        </div>
    ),
};

/**
 * A strip sets its own type scale against the container, because the same card serves a dense
 * page header and a roomy summary panel.
 */
export const Sized: Story = {
    args: { label: "Sized" },
    render: () => (
        <div className="kpi-story-strip" style={{ ...strip, gridTemplateColumns: "repeat(2, 1fr)" }}>
            <style>{`
                .kpi-story-strip .section.kpi { padding: 0.75rem 1rem; }
                .kpi-story-strip .kpi-value { font-size: 1.375rem; }
            `}</style>
            <Kpi label="Lowest Balance" tone="danger">
                <Kpi.Value>-$1,204.00</Kpi.Value>
                <Kpi.Sub>in March 2027</Kpi.Sub>
            </Kpi>
            <Kpi label="Sustainable Income" tone="success">
                <Kpi.Value>$61,000</Kpi.Value>
                <Kpi.Sub>a year, in today&rsquo;s dollars</Kpi.Sub>
            </Kpi>
        </div>
    ),
};

/**
 * Placeholders go inside the real label, value and caption, so the card is exactly as tall
 * loading as it is loaded and nothing below it moves when the data lands.
 */
export const Loading: Story = {
    args: { label: "Loading" },
    render: () => (
        <div style={strip}>
            {[0, 1, 2].map(i => (
                <Kpi key={i} label={<Skeleton.Text />}>
                    <Kpi.Value><Skeleton.Text /></Kpi.Value>
                    <Kpi.Sub><Skeleton.Text /></Kpi.Sub>
                </Kpi>
            ))}
        </div>
    ),
};
