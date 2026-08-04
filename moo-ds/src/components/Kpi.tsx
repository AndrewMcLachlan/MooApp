import classNames from "classnames";
import React from "react";
import { Section } from "../layout/Section/Section";
import type { BadgeHue, BadgeSemantic } from "./Badge";

/** The same named tokens a Badge takes, so a KPI and a Badge for the same thing agree on colour. */
export type KpiTone = BadgeSemantic | BadgeHue;

export interface KpiProps extends React.HTMLAttributes<HTMLElement> {
    /** The small uppercase label above the figure. */
    label: React.ReactNode;
    /**
     * Named token: a semantic variant or a hue. Colours the top bar and the figure.
     * Ignored for whichever of the two `colour`/`textColour` is also supplied.
     */
    tone?: KpiTone;
    /**
     * Any CSS colour for the top bar. Overrides `tone`.
     * Examples: "#3e9156", "rgb(62,145,86)", "var(--income-bar)".
     */
    colour?: string;
    /** Any CSS colour for the figure. Overrides `tone`. */
    textColour?: string;
}

export type KpiValueProps = React.HTMLAttributes<HTMLDivElement>;

export type KpiSubProps = React.HTMLAttributes<HTMLDivElement>;

type KpiCssVars = React.CSSProperties & {
    "--kpi-bar"?: string;
    "--kpi-fg"?: string;
};

const KpiValue: React.FC<React.PropsWithChildren<KpiValueProps>> = ({ className, children, ...rest }) => (
    <div className={classNames("kpi-value", className)} {...rest}>
        {children}
    </div>
);

KpiValue.displayName = "Kpi.Value";

const KpiSub: React.FC<React.PropsWithChildren<KpiSubProps>> = ({ className, children, ...rest }) => (
    <div className={classNames("kpi-sub", className)} {...rest}>
        {children}
    </div>
);

KpiSub.displayName = "Kpi.Sub";

/**
 * A headline figure on a card with a coloured top bar: a label, the number, and an optional
 * caption underneath.
 *
 * Type sizes are deliberately absent from the component's own CSS — a KPI strip in a page header
 * and one in a dashboard want different scales — so the consumer sets those against the container
 * around the cards.
 */
const KpiComponent: React.FC<React.PropsWithChildren<KpiProps>> = ({ label, tone, colour, textColour, className, children, style, ...rest }) => {

    let inlineStyle: KpiCssVars | undefined = style;
    if (colour || textColour) {
        inlineStyle = { ...style };
        if (colour) inlineStyle["--kpi-bar"] = colour;
        if (textColour) inlineStyle["--kpi-fg"] = textColour;
    }

    return (
        <Section className={classNames("kpi", tone && `kpi-${tone}`, className)} style={inlineStyle} {...rest}>
            <div className="kpi-label">{label}</div>
            {children}
        </Section>
    );
};

KpiComponent.displayName = "Kpi";

export const Kpi = Object.assign(KpiComponent, {
    Value: KpiValue,
    Sub: KpiSub,
});
