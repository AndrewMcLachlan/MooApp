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
        <div className="kpi-story-strip">
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
        <div className="kpi-story-strip">
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
        <div className="kpi-story-strip kpi-story-tokens">
            <Kpi label="Income" tone="income">
                <Kpi.Value>$8,200.00</Kpi.Value>
                <Kpi.Sub>this month</Kpi.Sub>
            </Kpi>
            <Kpi label="Expenses" tone="expense">
                <Kpi.Value>$6,431.90</Kpi.Value>
                <Kpi.Sub>this month</Kpi.Sub>
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
        <div className="kpi-story-strip kpi-story-pair">
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
        <div className="kpi-story-strip">
            {[0, 1, 2].map(i => (
                <Kpi key={i} label={<Skeleton.Text />}>
                    <Kpi.Value><Skeleton.Text /></Kpi.Value>
                    <Kpi.Sub><Skeleton.Text /></Kpi.Sub>
                </Kpi>
            ))}
        </div>
    ),
};
