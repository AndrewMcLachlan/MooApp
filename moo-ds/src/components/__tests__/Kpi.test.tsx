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

    it("defaults to the neutral tone so a figure with no direction gets the plain accent", () => {
        const { container } = render(<Kpi label="Count"><Kpi.Value>12</Kpi.Value></Kpi>);

        expect(container.querySelector(".kpi")).toHaveAttribute("data-tone", "neutral");
    });

    it("exposes the tone as an attribute, which is what the accent colour keys off", () => {
        const { container } = render(<Kpi label="Spend" tone="negative"><Kpi.Value>-$40</Kpi.Value></Kpi>);

        expect(container.querySelector(".kpi")).toHaveAttribute("data-tone", "negative");
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
