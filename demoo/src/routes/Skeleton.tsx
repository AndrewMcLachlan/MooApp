import { Page } from "@andrewmclachlan/moo-app";
import { Section, Skeleton, Button } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

export const SkeletonPage = () => {

    const [loaded, setLoaded] = useState(false);

    return (
        <Page title="Skeleton" breadcrumbs={[{ route: "/skeleton", text: "Skeleton" }]}>

            <Section title="About" header="Skeleton" headerSize={4}>
                <p>
                    Shimmering placeholders for content whose shape is known ahead of time. Prefer a
                    skeleton when the placeholder can mirror the real layout (text, avatars, blocks,
                    table rows); prefer a <code>Spinner</code> when the content shape is unknown or
                    irregular (charts, reports). The moving gradient respects
                    {" "}<code>prefers-reduced-motion</code>.
                </p>
            </Section>

            <Section title="Text" header="Skeleton.Text" headerSize={4}>
                <p>Single and multi-line. The final line of a multi-line block tapers.</p>
                <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", maxWidth: 640 }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <h5>Single line</h5>
                        <Skeleton.Text />
                    </div>
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <h5>Paragraph (4 lines)</h5>
                        <Skeleton.Text lines={4} />
                    </div>
                </div>
            </Section>

            <Section title="Circle" header="Skeleton.Circle" headerSize={4}>
                <p>Avatar placeholders in three preset sizes.</p>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <Skeleton.Circle size="sm" />
                    <Skeleton.Circle size="md" />
                    <Skeleton.Circle size="lg" />
                </div>
            </Section>

            <Section title="Rect" header="Skeleton.Rect" headerSize={4}>
                <p>A block that fills its container — size it via the surrounding layout.</p>
                <div style={{ width: 280, height: 140 }}>
                    <Skeleton.Rect />
                </div>
            </Section>

            <Section title="Composition" header="Composed: media object" headerSize={4}>
                <p>Compose the primitives to mirror a real layout — here an avatar beside text.</p>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", maxWidth: 420 }}>
                    <Skeleton.Circle size="lg" />
                    <div style={{ flex: 1 }}>
                        <Skeleton.Text lines={3} />
                    </div>
                </div>
            </Section>

            <Section title="In place of content" header="Standing in for loaded content" headerSize={4}>
                <p>
                    Toggle to compare the skeleton against the real content it stands in for. In a real
                    app this is driven by a query&apos;s loading state.
                </p>
                <Button onClick={() => setLoaded((l) => !l)}>
                    {loaded ? "Show skeleton" : "Show content"}
                </Button>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", maxWidth: 420, marginTop: "1rem" }}>
                    {loaded ? (
                        <>
                            <img
                                src="https://avatars.githubusercontent.com/u/3093264?v=4"
                                alt="Avatar"
                                width={64}
                                height={64}
                                style={{ borderRadius: "50%" }}
                            />
                            <div>
                                <strong>Andrew McLachlan</strong>
                                <p style={{ margin: 0 }}>Building an opinionated React design system and app framework.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton.Circle size="lg" />
                            <div style={{ flex: 1 }}>
                                <Skeleton.Text lines={3} />
                            </div>
                        </>
                    )}
                </div>
            </Section>

        </Page>
    );
}
