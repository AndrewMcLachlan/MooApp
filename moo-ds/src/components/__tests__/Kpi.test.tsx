import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../test-utils";
import { Kpi } from "../Kpi";

describe("Kpi", () => {
    it("renders as a section carrying the card and label classes", () => {
        const { container } = render(<Kpi label="Balance"><Kpi.Value>$1,000</Kpi.Value></Kpi>);

        expect(container.querySelector("section.section.kpi")).toBeInTheDocument();
        expect(container.querySelector(".kpi-label")).toHaveTextContent("Balance");
        expect(container.querySelector(".kpi-value")).toHaveTextContent("$1,000");
    });

    it("sets no colour of its own when no tone is asked for, so the card keeps the default bar", () => {
        const { container } = render(<Kpi label="Count"><Kpi.Value>12</Kpi.Value></Kpi>);

        expect(container.querySelector<HTMLElement>(".kpi")?.style.getPropertyValue("--kpi-bar")).toBe("");
    });

    it("resolves a semantic tone to its palette token, colouring bar and figure alike", () => {
        const { container } = render(<Kpi label="Income" tone="success"><Kpi.Value>$500</Kpi.Value></Kpi>);

        const card = container.querySelector<HTMLElement>(".kpi");
        expect(card?.style.getPropertyValue("--kpi-bar")).toBe("var(--hue-success)");
        expect(card?.style.getPropertyValue("--kpi-fg")).toBe("var(--hue-success)");
    });

    it("accepts a hue as readily as a semantic, since both are tokens", () => {
        const { container } = render(<Kpi label="Category" tone="teal"><Kpi.Value>3</Kpi.Value></Kpi>);

        expect(container.querySelector<HTMLElement>(".kpi")?.style.getPropertyValue("--kpi-bar")).toBe("var(--hue-teal)");
    });

    it("resolves a token an app has added to the palette the same way as a built-in one", () => {
        // The point of the registry: an app declares --hue-income in CSS and names it here, with
        // no class of its own to write and nothing to win in the cascade.
        const { container } = render(<Kpi label="Income" tone={"income" as never}><Kpi.Value>$500</Kpi.Value></Kpi>);

        expect(container.querySelector<HTMLElement>(".kpi")?.style.getPropertyValue("--kpi-bar")).toBe("var(--hue-income)");
    });

    it("lets an explicit colour override the tone for one part only", () => {
        const { container } = render(
            <Kpi label="Income" tone="success" textColour="#6cc67e"><Kpi.Value>$500</Kpi.Value></Kpi>,
        );

        const card = container.querySelector<HTMLElement>(".kpi");
        expect(card?.style.getPropertyValue("--kpi-bar")).toBe("var(--hue-success)");
        expect(card?.style.getPropertyValue("--kpi-fg")).toBe("#6cc67e");
    });

    it("takes a custom bar colour outside the palette", () => {
        const { container } = render(<Kpi label="Income" colour="#3e9156"><Kpi.Value>$500</Kpi.Value></Kpi>);

        expect(container.querySelector<HTMLElement>(".kpi")?.style.getPropertyValue("--kpi-bar")).toBe("#3e9156");
    });

    it("colours bar and figure independently, which is the case a single token can't cover", () => {
        const { container } = render(
            <Kpi label="Income" colour="var(--income-bar)" textColour="var(--income-fg)">
                <Kpi.Value>$500</Kpi.Value>
            </Kpi>,
        );

        const card = container.querySelector<HTMLElement>(".kpi");
        expect(card?.style.getPropertyValue("--kpi-bar")).toBe("var(--income-bar)");
        expect(card?.style.getPropertyValue("--kpi-fg")).toBe("var(--income-fg)");
    });

    it("keeps a consumer's own style alongside the colour variables", () => {
        const { container } = render(
            <Kpi label="Income" colour="#3e9156" style={{ gridColumn: "span 2" }}><Kpi.Value>$1</Kpi.Value></Kpi>,
        );

        const card = container.querySelector<HTMLElement>(".kpi");
        expect(card?.style.gridColumn).toBe("span 2");
        expect(card?.style.getPropertyValue("--kpi-bar")).toBe("#3e9156");
    });

    it("renders an optional caption under the figure", () => {
        render(<Kpi label="Income"><Kpi.Value>$500</Kpi.Value><Kpi.Sub>this month</Kpi.Sub></Kpi>);

        expect(screen.getByText("this month")).toBeInTheDocument();
    });

    it("keeps consumer class names alongside its own, so a strip can size its cards", () => {
        const { container } = render(<Kpi label="Balance" className="wide"><Kpi.Value className="strong">$1</Kpi.Value></Kpi>);

        expect(container.querySelector(".kpi")).toHaveClass("wide");
        expect(container.querySelector(".kpi-value")).toHaveClass("strong");
    });

    it("takes a node as the label, so a placeholder can stand in while data loads", () => {
        const { container } = render(<Kpi label={<span data-testid="placeholder" />}><Kpi.Value>—</Kpi.Value></Kpi>);

        expect(screen.getByTestId("placeholder")).toBeInTheDocument();
        // Still inside the label box, so it inherits that line's height rather than collapsing.
        expect(container.querySelector(".kpi-label")).toContainElement(screen.getByTestId("placeholder"));
    });
});
