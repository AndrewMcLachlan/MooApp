import { Page } from "@andrewmclachlan/moo-app";
import { Section, Spinner, SpinnerContainer, Skeleton, Button, ProgressIndeterminate } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { feedbackNav } from "../../nav";

export const Loading = () => {

    const [loaded, setLoaded] = useState(false);
    const [delayed, setDelayed] = useState(false);
    const [refreshing, setRefreshing] = useState(true);

    return (
        <Page title="Loading" breadcrumbs={[{ route: "/feedback/alerts", text: "Feedback" }, { route: "/feedback/loading", text: "Loading" }]} navItems={feedbackNav}>

            <Section title="Spinner" header="Spinner" headerSize={4}>
                <p>Use a spinner when the shape of the incoming content is unknown or irregular.</p>
                <p>
                    <code>comet</code> is the default: a conic-gradient tail masked into a ring,
                    turning once a second. It reads as motion blur rather than a moving object,
                    which sits better on these flat surfaces than the faster gap ring.
                </p>
                <div className="demo-row loose">
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner delay={0} /></div>
                        <p>Comet</p>
                    </div>
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner animation="border" delay={0} /></div>
                        <p>Border</p>
                    </div>
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner size="sm" delay={0} /></div>
                        <p>Comet SM</p>
                    </div>
                    <div className="demo-sample">
                        <div className="demo-sample-figure"><Spinner animation="border" size="sm" delay={0} /></div>
                        <p>Border SM</p>
                    </div>
                </div>
            </Section>

            <Section title="Spinner delay" header="Delay before appearing" headerSize={4}>
                <p>
                    A <code>Spinner</code> waits <code>delay</code> milliseconds (300 by default)
                    before it paints, so a fetch that resolves quickly never flashes one. Pass
                    {" "}<code>delay=&#123;0&#125;</code> to opt out &mdash; <code>Button</code> and
                    {" "}<code>IconButton</code> do, because a button&apos;s busy state is direct
                    feedback on a click and has to be immediate.
                </p>
                <Button className="demo-mb" onClick={() => setDelayed((d) => !d)}>
                    {delayed ? "Hide spinner" : "Show spinner (300ms delay)"}
                </Button>
                <div className="demo-row loose">
                    {delayed && (
                        <>
                            <div>
                                <Spinner />
                                <p>Default (300ms)</p>
                            </div>
                            <div>
                                <Spinner delay={0} />
                                <p>Immediate</p>
                            </div>
                        </>
                    )}
                </div>
            </Section>

            <Section title="Spinner container" header="SpinnerContainer" headerSize={4}>
                <p>A centred spinner that fills its container &mdash; the standard full-panel loading state.</p>
                <SpinnerContainer />
            </Section>

            <Section title="Progress indeterminate" header="ProgressIndeterminate" headerSize={4}>
                <p>
                    A thin indeterminate line for a panel that is refetching while its data is
                    already on screen. It never covers the content underneath, which is the whole
                    point &mdash; swapping the body for a <code>SpinnerContainer</code> is what this
                    pattern exists to avoid.
                </p>
                <p>The inline variant sits in the flow with pill ends:</p>
                <ProgressIndeterminate />
            </Section>

            <Section title="Progress indeterminate edge" header="Edge variant" headerSize={4} className={refreshing ? "is-refreshing" : undefined}>
                {refreshing && <ProgressIndeterminate variant="edge" aria-label="Refreshing" />}
                <p>
                    The <code>edge</code> variant pins itself flush to the top of the nearest
                    positioned ancestor &mdash; a <code>Section</code> is already one. Pair it with
                    {" "}<code>is-refreshing</code> on the host so the stale data recedes to 55%
                    rather than disappearing.
                </p>
                <p className="stat">$45,678</p>
            </Section>

            <Section title="Refresh toggle" header="Toggle the refresh" headerSize={4}>
                <Button onClick={() => setRefreshing((r) => !r)}>
                    {refreshing ? "Stop refreshing" : "Refresh the panel above"}
                </Button>
            </Section>

            <Section title="Skeleton about" header="Skeleton" headerSize={4}>
                <p>
                    Shimmering placeholders for content whose shape is known ahead of time. Prefer a
                    skeleton when the placeholder can mirror the real layout (text, avatars, blocks,
                    table rows); prefer a <code>Spinner</code> when the content shape is unknown or
                    irregular (charts, reports); prefer <code>ProgressIndeterminate</code> when the
                    panel already has data on screen and is refetching. The moving gradient respects
                    {" "}<code>prefers-reduced-motion</code>.
                </p>
            </Section>

            <Section title="Skeleton text" header="Skeleton.Text" headerSize={4}>
                <p>Single and multi-line. The final line of a multi-line block tapers.</p>
                <div className="skeleton-cols">
                    <div className="skeleton-col">
                        <h5>Single line</h5>
                        <Skeleton.Text />
                    </div>
                    <div className="skeleton-col">
                        <h5>Paragraph (4 lines)</h5>
                        <Skeleton.Text lines={4} />
                    </div>
                </div>
            </Section>

            <Section title="Skeleton circle" header="Skeleton.Circle" headerSize={4}>
                <p>Avatar placeholders in three preset sizes.</p>
                <div className="demo-row">
                    <Skeleton.Circle size="sm" />
                    <Skeleton.Circle size="md" />
                    <Skeleton.Circle size="lg" />
                </div>
            </Section>

            <Section title="Skeleton rect" header="Skeleton.Rect" headerSize={4}>
                <p>A block that fills its container &mdash; size it via the surrounding layout.</p>
                <div className="skeleton-rect">
                    <Skeleton.Rect />
                </div>
            </Section>

            <Section title="Skeleton chart" header="Skeleton.Chart" headerSize={4}>
                <p>
                    Stands in for a chart that has no data yet. Chart.js renders to a canvas and
                    paints nothing at all &mdash; no axes, no legend, no frame &mdash; until data
                    arrives, so the skeleton owns the whole visual for the wait.
                </p>
                <p>
                    It draws only what is invariant for a shape: the elements, plus a baseline axis
                    where one always exists. Legends and tick labels are left out on purpose &mdash;
                    they can&apos;t be guessed from outside the chart&apos;s own config, and
                    furniture that turns out wrong is worse than none. <code>count</code> is bars,
                    series lines, or slices depending on the variant.
                </p>
                <div className="demo-chart-grid">
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="bar" /></div>
                        <p>bar</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="horizontal-bar" /></div>
                        <p>horizontal-bar</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="line" /></div>
                        <p>line</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="pie" /></div>
                        <p>pie</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="doughnut" /></div>
                        <p>doughnut</p>
                    </div>
                </div>
            </Section>

            <Section title="Skeleton chart counts" header="Varying count" headerSize={4}>
                <p>
                    Bar sizes cycle through eight fixed steps and line paths through four, rather
                    than being randomised &mdash; random values break SSR hydration and make
                    snapshots flicker. Past those counts the pattern repeats.
                </p>
                <div className="demo-chart-grid">
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="bar" count={3} /></div>
                        <p>bar, count 3</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="bar" count={12} /></div>
                        <p>bar, count 12</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="line" count={4} /></div>
                        <p>line, count 4</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="doughnut" count={3} /></div>
                        <p>doughnut, count 3</p>
                    </div>
                    <div>
                        <div className="demo-chart"><Skeleton.Chart variant="pie" count={12} /></div>
                        <p>pie, count 12</p>
                    </div>
                </div>
            </Section>

            <Section title="Skeleton composition" header="Composed: media object" headerSize={4}>
                <p>Compose the primitives to mirror a real layout &mdash; here an avatar beside text.</p>
                <div className="skeleton-media">
                    <Skeleton.Circle size="lg" />
                    <div className="fill">
                        <Skeleton.Text lines={3} />
                    </div>
                </div>
            </Section>

            <Section title="Skeleton in place" header="Standing in for loaded content" headerSize={4}>
                <p>
                    Toggle to compare the skeleton against the real content it stands in for. In a real
                    app this is driven by a query&apos;s loading state.
                </p>
                <Button className="demo-mb" onClick={() => setLoaded((l) => !l)}>
                    {loaded ? "Show skeleton" : "Show content"}
                </Button>
                <div className="skeleton-media">
                    {loaded ? (
                        <>
                            <img
                                className="avatar-lg"
                                src="https://avatars.githubusercontent.com/u/3093264?v=4"
                                alt="Avatar"
                                width={64}
                                height={64}
                            />
                            <div className="fill">
                                <strong>Andrew McLachlan</strong>
                                <p>Building an opinionated React design system and app framework.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton.Circle size="lg" />
                            <div className="fill">
                                <Skeleton.Text lines={3} />
                            </div>
                        </>
                    )}
                </div>
            </Section>

        </Page>
    );
}
