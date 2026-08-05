import classNames from "classnames";
import React from "react";
import { Section } from "../layout/Section/Section";
import type { Tone } from "../models/Colours";

export interface KpiProps extends React.HTMLAttributes<HTMLElement> {
    /** The small uppercase label above the figure. */
    label: React.ReactNode;
    /**
     * A colour token — a semantic variant, a hue, or one an app has added to the palette.
     * Colours the top bar and the figure.
     *
     * An app adds a token by declaring the colour and the rule that uses it in its own CSS, then
     * registering the name so it type-checks. There is no colour prop: a value passed from a
     * component call can only ever be one colour, and every one of these has to answer to a light
     * scheme and a dark one.
     *
     * ```css
     * :root      { --hue-income: light-dark(#3e9156, #6cc67e); }
     * .kpi-income { --kpi-bar: var(--hue-income); --kpi-fg: var(--hue-income); }
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
 * Type sizes are deliberately absent from the component's own CSS — a KPI strip in a page header
 * and one on a dashboard want different scales — so the consumer sets those against the container
 * around the cards.
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
