import { Page } from "@andrewmclachlan/moo-app";
import { Kpi, Section, Skeleton, type Hue, type Variant } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { dataNav } from "../../nav";

const variants: Variant[] = ["primary", "secondary", "success", "warning", "danger", "info"];

const hues: Hue[] = [
    "blue", "indigo", "purple", "pink", "rose", "orange", "amber",
    "yellow", "green", "emerald", "teal", "cyan", "slate", "neutral",
];

export const KpiPage = () => {

    const [loading, setLoading] = useState(false);

    return (
        <Page title="KPI" breadcrumbs={[{ route: "/data/table", text: "Data" }, { route: "/data/kpi", text: "KPI" }]} navItems={dataNav}>

            <Section title="KPI" header="KPI" headerSize={4}>
                <p>
                    A headline figure on a card with a coloured top bar: a label, the number, and an
                    optional caption. Reach for it where a page opens with a handful of figures that
                    summarise what is below.
                </p>
                <p>
                    Type sizes are deliberately not part of the component &mdash; a strip in a page
                    header and one on a dashboard want different scales &mdash; so a KPI takes its
                    size from the container you put it in.
                </p>
                <div className="kpi-demo-strip">
                    <Kpi label="Total Users">
                        <Kpi.Value>1,234</Kpi.Value>
                        <Kpi.Sub>across all tenants</Kpi.Sub>
                    </Kpi>
                    <Kpi label="Revenue" tone="success">
                        <Kpi.Value>$45,678</Kpi.Value>
                        <Kpi.Sub>up 12% on last month</Kpi.Sub>
                    </Kpi>
                    <Kpi label="Churn" tone="danger">
                        <Kpi.Value>3.4%</Kpi.Value>
                        <Kpi.Sub>up 0.8pt on last month</Kpi.Sub>
                    </Kpi>
                </div>
            </Section>

            <Section title="Tones" header="Tones" headerSize={4}>
                <p>
                    <code>tone</code> takes a colour token &mdash; a semantic variant or a hue,
                    the same names a <code>Badge</code> takes &mdash; and colours the bar and the
                    figure. Semantics say what a number means; hues are for identity, where being
                    told a category apart matters and good or bad does not apply.
                </p>
                <div className="kpi-demo-strip">
                    {variants.map(tone => (
                        <Kpi key={tone} label={tone} tone={tone}>
                            <Kpi.Value>$8,200</Kpi.Value>
                        </Kpi>
                    ))}
                </div>
                <div className="kpi-demo-strip tight">
                    {hues.map(tone => (
                        <Kpi key={tone} label={tone} tone={tone}>
                            <Kpi.Value>184</Kpi.Value>
                        </Kpi>
                    ))}
                </div>
            </Section>

            <Section title="Adding a colour" header="Adding a colour" headerSize={4}>
                <p>
                    A token is only a name; the colour behind it is a <code>--hue-&lt;name&gt;</code>
                    custom property. To add one, declare it in CSS with <code>light-dark()</code> so
                    both schemes are handled in one place, and register the name so it type-checks:
                </p>
                <pre className="demo-code">{`/* app CSS */
:root {
    --hue-income:  light-dark(#3e9156, #6cc67e);
    --hue-expense: light-dark(#a4332d, #e07b7b);
}

/* app types.d.ts */
declare module "@andrewmclachlan/moo-ds" {
    interface HueRegistry {
        income: true;
        expense: true;
    }
}`}</pre>
                <p>
                    After that a token of your own behaves exactly as a built-in one does, with no
                    colour values in the markup and no stylesheet of yours needing to win against
                    this one:
                </p>
                <div className="kpi-demo-strip kpi-demo-tokens">
                    <Kpi label="Income" tone={"income" as Hue}>
                        <Kpi.Value>$8,200.00</Kpi.Value>
                        <Kpi.Sub>this month</Kpi.Sub>
                    </Kpi>
                    <Kpi label="Expenses" tone={"expense" as Hue}>
                        <Kpi.Value>$6,431.90</Kpi.Value>
                        <Kpi.Sub>this month</Kpi.Sub>
                    </Kpi>
                </div>
                <p className="demo-note">
                    demoo declares those two in its own stylesheet and casts the names here, having
                    no registry of its own; a real app registers them and drops the cast.
                </p>
            </Section>


            <Section title="Loading" header="Loading" headerSize={4}>
                <p>
                    Put a <code>Skeleton.Text</code> inside the label, the value and the caption
                    rather than replacing the card. Each placeholder takes its own line&rsquo;s
                    height, so the strip is exactly as tall loading as it is loaded and nothing
                    below it moves when the figures arrive. Toggle it and watch the section under
                    the strip stay put.
                </p>
                <div className="demo-row">
                    <button className="btn btn-outline-primary" onClick={() => setLoading(!loading)}>
                        {loading ? "Show figures" : "Show placeholders"}
                    </button>
                </div>
                <div className="kpi-demo-strip">
                    {["Total Users", "Revenue", "Churn"].map((label, i) => (
                        <Kpi key={label} label={loading ? <Skeleton.Text /> : label} tone={loading ? undefined : "success"}>
                            <Kpi.Value>{loading ? <Skeleton.Text /> : ["1,234", "$45,678", "3.4%"][i]}</Kpi.Value>
                            <Kpi.Sub>{loading ? <Skeleton.Text /> : "since last month"}</Kpi.Sub>
                        </Kpi>
                    ))}
                </div>
                <p className="demo-note">Anything below the strip should not move when you toggle.</p>
            </Section>

        </Page>
    );
};
