import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, Tab } from "@andrewmclachlan/moo-ds";
import { useState } from "react";
import { faCog, faList, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

const meta = {
    title: "Moo App/Components/Tab",
    component: Tabs,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Tabs defaultActiveKey="details">
            <Tab eventKey="details" title="Details">
                <p>Details content goes here.</p>
            </Tab>
            <Tab eventKey="settings" title="Settings">
                <p>Settings content goes here.</p>
            </Tab>
            <Tab eventKey="history" title="History">
                <p>History content goes here.</p>
            </Tab>
        </Tabs>
    ),
};

export const WithDisabledTab: Story = {
    render: () => (
        <Tabs defaultActiveKey="active">
            <Tab eventKey="active" title="Active">
                <p>This tab is active.</p>
            </Tab>
            <Tab eventKey="disabled" title="Disabled" disabled>
                <p>This tab cannot be selected.</p>
            </Tab>
            <Tab eventKey="other" title="Other">
                <p>Another tab.</p>
            </Tab>
        </Tabs>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <Tabs defaultActiveKey="details">
            <Tab eventKey="details" title="Details" icon={faList}>
                <p>Details content with an icon tab.</p>
            </Tab>
            <Tab eventKey="settings" title="Settings" icon={faCog}>
                <p>Settings content with an icon tab.</p>
            </Tab>
            <Tab eventKey="history" title="History" icon={faClockRotateLeft}>
                <p>History content with an icon tab.</p>
            </Tab>
        </Tabs>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [activeKey, setActiveKey] = useState("one");
        return (
            <>
                <p>Active tab: <strong>{activeKey}</strong></p>
                <Tabs activeKey={activeKey} onSelect={setActiveKey}>
                    <Tab eventKey="one" title="Tab One">
                        <p>Content for tab one.</p>
                    </Tab>
                    <Tab eventKey="two" title="Tab Two">
                        <p>Content for tab two.</p>
                    </Tab>
                    <Tab eventKey="three" title="Tab Three">
                        <p>Content for tab three.</p>
                    </Tab>
                </Tabs>
            </>
        );
    },
};
