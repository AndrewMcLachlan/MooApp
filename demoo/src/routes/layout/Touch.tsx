import { Page } from "@andrewmclachlan/moo-app";
import { Alert, Badge, PullToRefresh, Section, SwipeRow } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { layoutNav } from "../../nav";

interface Run {
    id: number;
    repo: string;
    workflow: string;
    status: "Passed" | "Failed" | "Running";
}

const seed: Run[] = [
    { id: 1, repo: "acme/site", workflow: "Build and Publish", status: "Passed" },
    { id: 2, repo: "acme/site", workflow: "Nightly", status: "Failed" },
    { id: 3, repo: "acme/api", workflow: "Build", status: "Running" },
    { id: 4, repo: "acme/api", workflow: "Deploy", status: "Passed" },
    { id: 5, repo: "acme/tools", workflow: "Lint", status: "Passed" },
    { id: 6, repo: "acme/tools", workflow: "Release", status: "Failed" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const TouchPage = () => {

    const [runs, setRuns] = useState(seed);
    const [refreshCount, setRefreshCount] = useState(0);
    const [lastAction, setLastAction] = useState<string | null>(null);

    const refresh = async () => {
        // A real page would refetch here; the delay stands in for the network
        // so the indicator can be seen doing its job.
        await wait(1200);
        setRefreshCount((count) => count + 1);
        setRuns((current) => (current.length === 0 ? seed : [...current].reverse()));
    };

    return (
        <Page title="Touch" breadcrumbs={[{ route: "/layout/page-sections", text: "Layout" }, { route: "/layout/touch", text: "Touch" }]} navItems={layoutNav}>

            <Section title="Touch" header="Pull to refresh & swipe" headerSize={4}>
                <p>
                    Both gestures are touch only. On a desktop browser use device emulation, or open
                    demoo on a phone over the network address the dev server prints.
                </p>
                <p>
                    Drag down from the top of the list to refresh it. Swipe a row to the left to
                    reveal its actions — the same actions are reachable by tab, with no gesture.
                </p>

                {lastAction && (
                    <Alert variant="info" dismissible onClose={() => setLastAction(null)}>{lastAction}</Alert>
                )}

                <p>Refreshed {refreshCount} {refreshCount === 1 ? "time" : "times"}.</p>

                <PullToRefresh onRefresh={refresh} className="demo-touch-list">
                    {runs.map((run) => (
                        <SwipeRow
                            key={run.id}
                            actions={[
                                {
                                    key: "approve",
                                    label: "Approve",
                                    variant: "primary",
                                    disabled: run.status === "Running",
                                    onAction: () => setLastAction(`Approved ${run.repo} · ${run.workflow}`),
                                },
                                {
                                    key: "dismiss",
                                    label: "Dismiss",
                                    variant: "danger",
                                    onAction: () => setRuns((current) => current.filter((r) => r.id !== run.id)),
                                },
                            ]}
                        >
                            <div className="demo-touch-row">
                                <div>
                                    <strong>{run.workflow}</strong>
                                    <div className="demo-touch-repo">{run.repo}</div>
                                </div>
                                <Badge bg={run.status === "Failed" ? "danger" : run.status === "Running" ? "info" : "success"}>
                                    {run.status}
                                </Badge>
                            </div>
                        </SwipeRow>
                    ))}
                </PullToRefresh>

                {runs.length === 0 && <p>Every row dismissed. Pull down to bring them back.</p>}
            </Section>
        </Page>
    );
};
