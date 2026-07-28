import { Page } from "@andrewmclachlan/moo-app";
import { Section, ThemeSelector } from "@andrewmclachlan/moo-ds";
import { appNav } from "../../nav";

export const Providers = () => {

    return (
        <Page title="Providers & Theming" breadcrumbs={[{ route: "/app/providers", text: "App Framework" }, { route: "/app/providers", text: "Providers & Theming" }]} navItems={appNav}>

            <Section title="Providers" header="Provider hierarchy" headerSize={4}>
                <p>
                    <code>MooApp</code> wires up the whole application: authentication (MSAL), data
                    fetching (React Query), theming, links and messages, then renders your router. The
                    nesting is:
                </p>
                <p>
                    <code>AppProvider &rarr; ThemeProvider &rarr; MsalProvider &rarr; MsalAuthProvider &rarr; QueryClientProvider &rarr; LinkProvider &rarr; MessageProvider &rarr; Login &rarr; RouterProvider</code>
                </p>
                <p>
                    <code>ThemeProvider</code> sits above the auth boundary, so even the unauthenticated
                    login screen is themed. This very demo app is a <code>MooApp</code> &mdash; see
                    {" "}<code>demoo/src/index.tsx</code> for the full setup.
                </p>
            </Section>

            <Section title="Theming" header="ThemeSelector" headerSize={4}>
                <p>
                    <code>ThemeSelector</code> switches between the registered themes (light / dark /
                    system by default; the list is extensible via <code>ThemeProvider</code>). Try it
                    &mdash; the whole shell re-themes live.
                </p>
                <ThemeSelector />
            </Section>

        </Page>
    );
}
