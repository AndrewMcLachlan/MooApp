import { Page } from "@andrewmclachlan/moo-app";
import { Section, Input, Password, SearchBox } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { formsNav } from "../../nav";

export const Inputs = () => {

    const [search, setSearch] = useState("");

    return (
        <Page title="Inputs" breadcrumbs={[{ route: "/forms/form", text: "Forms" }, { route: "/forms/inputs", text: "Inputs" }]} navItems={formsNav}>

            <Section title="Text input" header="Input" headerSize={4}>
                <p>The base text control. It supports a <code>clearable</code> affordance that shows a clear button once there is a value.</p>
                <div className="demo-col">
                    <Input placeholder="Plain input" />
                    <Input placeholder="Clearable input" clearable defaultValue="Clear me" />
                    <Input placeholder="Disabled" disabled />
                </div>
            </Section>

            <Section title="Search" header="SearchBox" headerSize={4}>
                <p>A search-styled input used in the app header. It is controlled &mdash; here it echoes what you type.</p>
                <div className="demo-col">
                    <SearchBox value={search} onChange={setSearch} />
                    <span>Query: <strong>{search || <em>(empty)</em>}</strong></span>
                </div>
            </Section>

            <Section title="Password" header="Password" headerSize={4}>
                <p>A password field with a show/hide toggle.</p>
                <Password />
            </Section>

            <Section title="Checks & radios" header="Input.Check" headerSize={4}>
                <p>Checkboxes and radios, inline or stacked.</p>
                <div className="demo-col">
                    <Input.Check id="chk1" label="Accept terms" defaultChecked />
                    <Input.Check id="chk2" label="Subscribe to updates" />
                    <div className="demo-row">
                        <Input.Check id="rad1" type="radio" name="plan" label="Monthly" inline defaultChecked />
                        <Input.Check id="rad2" type="radio" name="plan" label="Yearly" inline />
                    </div>
                </div>
            </Section>

            <Section title="Switches" header="Input.Switch" headerSize={4}>
                <p>Toggle switches for on/off settings.</p>
                <Input.Switch id="switch1" label="Off switch" />
                <Input.Switch id="switch2" label="On switch" defaultChecked />
                <Input.Switch id="switch3" label="Disabled off" disabled />
                <Input.Switch id="switch4" label="Disabled on" defaultChecked disabled />
            </Section>

        </Page>
    );
}
