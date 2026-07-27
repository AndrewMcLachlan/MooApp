import { Page } from "@andrewmclachlan/moo-app";
import { Section, Button } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { appNav } from "../../nav";

// Throwing during render is what an error boundary catches. Gate it behind a
// button so visiting the page doesn't immediately blow up.
const Boom = () => {
    throw new Error("Deliberate demo error from the Error Handling page.");
};

export const ErrorHandling = () => {

    const [boom, setBoom] = useState(false);

    return (
        <Page title="Error Handling" breadcrumbs={[{ route: "/app/providers", text: "App Framework" }, { route: "/app/error-handling", text: "Error Handling" }]} navItems={appNav}>

            <Section title="Error boundaries" header="Error boundaries" headerSize={4}>
                <p>
                    <code>MooAppLayout</code> wraps page content in an error boundary. When a page throws
                    during render, the boundary catches it and shows the framework&rsquo;s error screen
                    instead of a blank page. Trigger one below &mdash; navigate away (or reload) to recover.
                </p>
                <Button variant="danger" onClick={() => setBoom(true)}>Trigger a render error</Button>
                {boom && <Boom />}
            </Section>

        </Page>
    );
}
