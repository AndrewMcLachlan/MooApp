import { Dashboard } from "@andrewmclachlan/moo-app";
import { Widget, Badge, Button } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { layoutNav } from "../../nav";

const activity = [
    { user: "alice", action: "created a project", variant: "info", tag: "New" },
    { user: "deploy", action: "shipped v2.4.1", variant: "success", tag: "Success" },
    { user: "ci", action: "build #1087 failed", variant: "danger", tag: "Failed" },
    { user: "bob", action: "updated settings", variant: "primary", tag: "Update" },
    { user: "carol", action: "invited two teammates", variant: "info", tag: "New" },
] as const;

export const DashboardPage = () => {

    const [loading, setLoading] = useState(false);

    return (
        // Dashboard is a Page, so this route renders one directly rather than
        // nesting one inside a Page. Every child becomes a grid cell, which is
        // why the notes below live in a Widget rather than a Section.
        <Dashboard
            title="Dashboard"
            breadcrumbs={[{ route: "/layout/dashboard", text: "Layout" }, { route: "/layout/dashboard", text: "Dashboard" }]}
            navItems={layoutNav}
        >
            <Widget header="About" size="double" headerSize={5}>
                <p>
                    <code>Dashboard</code> is a <code>Page</code> whose children lay out on a fixed-row
                    grid. Each child is a cell: <code>Widget</code> takes <code>size</code> of
                    <code> single</code> or <code>double</code>, and a double spans two rows.
                </p>
                <p>
                    The grid fills gaps as it goes, so a short widget declared after a tall one will
                    slot back into the space beside it rather than leaving a hole.
                </p>
                <p>
                    Column count follows the width of the content area, not the window &mdash; collapse
                    the sidebar and the grid regains a column at the same window size.
                </p>
            </Widget>

            <Widget header="Total Users" size="single" headerSize={5}>
                <p className="stat">1,234</p>
                <Badge bg="success">+12%</Badge>
            </Widget>

            <Widget header="Revenue" size="single" headerSize={5}>
                <p className="stat">$45,678</p>
                <Badge bg="success">+4%</Badge>
            </Widget>

            <Widget header="Recent Activity" size="double" headerSize={5}>
                <ul className="dashboard-feed">
                    {activity.map((a) => (
                        <li key={`${a.user}-${a.action}`}>
                            <strong>{a.user}</strong> {a.action} <Badge bg={a.variant}>{a.tag}</Badge>
                        </li>
                    ))}
                </ul>
            </Widget>

            <Widget header="Active Sessions" size="single" headerSize={5} loading={loading}>
                <p className="stat">342</p>
                <Badge bg="info">Live</Badge>
            </Widget>

            <Widget header="Loading state" size="single" headerSize={5}>
                <p>A widget swaps its body for a spinner while <code>loading</code> is set.</p>
                <Button variant="outline-primary" onClick={() => setLoading(!loading)}>
                    {loading ? "Stop loading" : "Load Active Sessions"}
                </Button>
            </Widget>

            <Widget header="Open Tickets" size="single" headerSize={5} to="/data/table">
                <p className="stat">28</p>
                <Badge bg="warning">Linked widget</Badge>
            </Widget>

            <Widget header="Error Rate" size="single" headerSize={5}>
                <p className="stat">0.4%</p>
                <Badge bg="danger">-0.1%</Badge>
            </Widget>
        </Dashboard>
    );
}
