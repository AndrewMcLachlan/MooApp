import { Page } from "@andrewmclachlan/moo-app";
import { Section, Spinner, SpinnerContainer, Skeleton, Button } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { feedbackNav } from "../../nav";

export const Loading = () => {

    const [loaded, setLoaded] = useState(false);

    return (
        <Page title="Loading" breadcrumbs={[{ route: "/feedback/alerts", text: "Feedback" }, { route: "/feedback/loading", text: "Loading" }]} navItems={feedbackNav}>

            <Section title="Spinner" header="Spinner" headerSize={4}>
                <p>Use a spinner when the shape of the incoming content is unknown or irregular.</p>
                <div className="demo-row loose">
                    <div>
                        <Spinner animation="border" />
                        <p>Border</p>
                    </div>
                    <div>
                        <Spinner animation="grow" />
                        <p>Grow</p>
                    </div>
                    <div>
                        <Spinner animation="border" size="sm" />
                        <p>Border SM</p>
                    </div>
                    <div>
                        <Spinner animation="grow" size="sm" />
                        <p>Grow SM</p>
                    </div>
                </div>
            </Section>

            <Section title="Spinner container" header="SpinnerContainer" headerSize={4}>
                <p>A centred spinner that fills its container &mdash; the standard full-panel loading state.</p>
                <SpinnerContainer />
            </Section>

            <Section title="Skeleton about" header="Skeleton" headerSize={4}>
                <p>
                    Shimmering placeholders for content whose shape is known ahead of time. Prefer a
                    skeleton when the placeholder can mirror the real layout (text, avatars, blocks,
                    table rows); prefer a <code>Spinner</code> when the content shape is unknown or
                    irregular (charts, reports). The moving gradient respects
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
