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

/** A single figure. With no tone the accent is the theme's primary colour. */
export const Default: Story = {
    args: { label: "Balance" },
    render: (args) => (
        <Kpi {...args}>
            <Kpi.Value>$12,480.55</Kpi.Value>
            <Kpi.Sub>as at today</Kpi.Sub>
        </Kpi>
    ),
};

/** The tone sets the top edge. Positive and negative are directions, not domain words. */
export const Tones: Story = {
    args: { label: "Tone" },
    render: () => (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            <Kpi label="Income" tone="positive">
                <Kpi.Value>$8,200.00</Kpi.Value>
                <Kpi.Sub>this month</Kpi.Sub>
            </Kpi>
            <Kpi label="Expenses" tone="negative">
                <Kpi.Value>$6,431.90</Kpi.Value>
                <Kpi.Sub>this month</Kpi.Sub>
            </Kpi>
            <Kpi label="Transactions" tone="neutral">
                <Kpi.Value>184</Kpi.Value>
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
        <div className="kpi-story-strip" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
            <style>{`
                .kpi-story-strip .section.kpi { padding: 0.75rem 1rem; }
                .kpi-story-strip .kpi-value { font-size: 1.375rem; }
            `}</style>
            <Kpi label="Lowest Balance" tone="negative">
                <Kpi.Value>-$1,204.00</Kpi.Value>
                <Kpi.Sub>in March 2027</Kpi.Sub>
            </Kpi>
            <Kpi label="Sustainable Income" tone="positive">
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            {[0, 1, 2].map(i => (
                <Kpi key={i} label={<Skeleton.Text />}>
                    <Kpi.Value><Skeleton.Text /></Kpi.Value>
                    <Kpi.Sub><Skeleton.Text /></Kpi.Sub>
                </Kpi>
            ))}
        </div>
    ),
};

/** An app can repoint the accent for a whole strip via --kpi-accent, without restating the card. */
export const CustomAccent: Story = {
    args: { label: "Custom accent" },
    render: () => (
        <div className="kpi-story-brand" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
            <style>{`
                .kpi-story-brand .section.kpi[data-tone="positive"] { --kpi-accent: #3e9156; }
                .kpi-story-brand .section.kpi[data-tone="negative"] { --kpi-accent: #a4332d; }
            `}</style>
            <Kpi label="Income" tone="positive">
                <Kpi.Value>$8,200.00</Kpi.Value>
            </Kpi>
            <Kpi label="Expenses" tone="negative">
                <Kpi.Value>$6,431.90</Kpi.Value>
            </Kpi>
        </div>
    ),
};
