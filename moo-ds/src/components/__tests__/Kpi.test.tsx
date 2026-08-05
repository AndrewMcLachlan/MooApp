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

    it("takes no tone class when none is asked for, so the card keeps the default bar", () => {
        const { container } = render(<Kpi label="Count"><Kpi.Value>12</Kpi.Value></Kpi>);

        // Every tone class, not a few named ones: a stray kpi-anything would recolour the card.
        const classes = [...container.querySelector(".kpi")!.classList];
        expect(classes.filter(c => c.startsWith("kpi-"))).toEqual([]);
    });

    it("maps a semantic tone to its class", () => {
        const { container } = render(<Kpi label="Income" tone="success"><Kpi.Value>$500</Kpi.Value></Kpi>);

        expect(container.querySelector(".kpi")).toHaveClass("kpi-success");
    });

    it("accepts a hue as readily as a semantic, since both are tokens", () => {
        const { container } = render(<Kpi label="Category" tone="teal"><Kpi.Value>3</Kpi.Value></Kpi>);

        expect(container.querySelector(".kpi")).toHaveClass("kpi-teal");
    });

    it("names a token an app has added the same way as a built-in one", () => {
        // The registry's point: the app declares --hue-income and a .kpi-income rule, and the
        // component does nothing different for it.
        const { container } = render(<Kpi label="Income" tone={"income" as never}><Kpi.Value>$500</Kpi.Value></Kpi>);

        expect(container.querySelector(".kpi")).toHaveClass("kpi-income");
    });

    it("sets no inline style, so colour stays entirely in CSS", () => {
        const { container } = render(<Kpi label="Income" tone="success"><Kpi.Value>$500</Kpi.Value></Kpi>);

        expect(container.querySelector<HTMLElement>(".kpi")?.getAttribute("style")).toBeNull();
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
