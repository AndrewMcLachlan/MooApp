import { Page } from "@andrewmclachlan/moo-app";
import { Section, Upload } from "@andrewmclachlan/moo-ds";
import { formsNav } from "../../nav";

export const UploadPage = () => {

    return (
        <Page title="Upload" breadcrumbs={[{ route: "/forms/form", text: "Forms" }, { route: "/forms/upload", text: "Upload" }]} navItems={formsNav}>

            <Section title="Multiple files" header="Attach supporting documents" headerSize={4}>
                <p>A drop target that also accepts a click-to-browse. <code>allowMultiple</code> lets several files be attached and <code>accept</code> restricts the file types.</p>
                <Upload allowMultiple accept=".pdf,.jpg,.png,.doc,.docx" />
            </Section>

            <Section title="Single image" header="Upload avatar" headerSize={4}>
                <p>A single-file variant limited to images.</p>
                <Upload accept="image/*" />
            </Section>

        </Page>
    );
}
