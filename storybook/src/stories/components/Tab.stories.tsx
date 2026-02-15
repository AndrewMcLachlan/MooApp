import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab } from "@andrewmclachlan/moo-ds";
import { useState } from "react";

const meta = {
    title: "Moo App/Components/Tab",
    component: Tab.Container,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Tab.Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Tab.Container defaultActiveKey="details">
            <Tab.Content>
                <Tab.Pane eventKey="details" title="Details">
                    <p>Details content goes here.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="settings" title="Settings">
                    <p>Settings content goes here.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="history" title="History">
                    <p>History content goes here.</p>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    ),
};

export const WithDisabledTab: Story = {
    render: () => (
        <Tab.Container defaultActiveKey="active">
            <Tab.Content>
                <Tab.Pane eventKey="active" title="Active">
                    <p>This tab is active.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="disabled" title="Disabled" disabled>
                    <p>This tab cannot be selected.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="other" title="Other">
                    <p>Another tab.</p>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    ),
};

export const Controlled: Story = {
    render: () => {
        const [activeKey, setActiveKey] = useState("one");
        return (
            <>
                <p>Active tab: <strong>{activeKey}</strong></p>
                <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
                    <Tab.Content>
                        <Tab.Pane eventKey="one" title="Tab One">
                            <p>Content for tab one.</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="two" title="Tab Two">
                            <p>Content for tab two.</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="three" title="Tab Three">
                            <p>Content for tab three.</p>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </>
        );
    },
};
