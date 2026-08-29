import classNames from "classnames";
import React from "react";
import { Section } from "../layout/Section/Section";
import type { Tone } from "../models/Colours";

export interface KpiProps extends React.HTMLAttributes<HTMLElement> {
    /** The small uppercase label above the figure. */
    label: React.ReactNode;
    /**
     * A colour token — a semantic variant, a hue, or one an app has added to the palette.
     *
     * A tone sets two things, and they need not be the same colour: `--kpi-bar` is the line and
     * `--kpi-fg` the figure. A line wants enough weight to read as a rule and a figure enough
     * contrast to read as text, so the two often want different steps of one hue.
     *
     * Adding a tone is one rule in your own CSS — nothing to declare to TypeScript, and no colour
     * prop, because a value passed from a component call can only ever be one colour and each of
     * these has to answer to a light scheme and a dark one.
     *
     * ```css
     * :root {
     *     --hue-income:      light-dark(#2f6f42, #3e9156);
     *     --hue-income-text: light-dark(#3e9156, #6cc67e);
     * }
     *
     * .section.kpi-income {
     *     --kpi-bar: var(--hue-income);
     *     --kpi-fg:  var(--hue-income-text);
     * }
     * ```
     */
    tone?: Tone;
}

export type KpiValueProps = React.HTMLAttributes<HTMLDivElement>;

export type KpiSubProps = React.HTMLAttributes<HTMLDivElement>;

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
 * Type sizes come from the consumer, set against the container around the cards: a KPI strip
 * in a page header and one on a dashboard want different scales.
 */
const KpiComponent: React.FC<React.PropsWithChildren<KpiProps>> = ({ label, tone, className, children, ...rest }) => (
    <Section className={classNames("kpi", tone && `kpi-${tone}`, className)} {...rest}>
        <div className="kpi-label">{label}</div>
        {children}
    </Section>
);

KpiComponent.displayName = "Kpi";

export const Kpi = Object.assign(KpiComponent, {
    Value: KpiValue,
    Sub: KpiSub,
});
