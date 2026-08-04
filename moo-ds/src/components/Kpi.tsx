import classNames from "classnames";
import React from "react";
import { Section } from "../layout/Section/Section";

/**
 * Which way a figure reads. Deliberately not domain wording — an app decides whether its
 * "income" is positive and its "spend" negative, and can repoint the accent per context by
 * setting `--kpi-accent`.
 */
export type KpiTone = "positive" | "negative" | "neutral";

export interface KpiProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
    /** The small uppercase label above the figure. */
    label: React.ReactNode;
    tone?: KpiTone;
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
 * A headline figure on a card with a coloured top edge: a label, the number, and an optional
 * caption underneath.
 *
 * Type sizes are deliberately absent from the component's own CSS — a KPI strip in a page header
 * and one in a dashboard want different scales, so the consumer sets those against the container
 * around the cards.
 */
const KpiComponent: React.FC<React.PropsWithChildren<KpiProps>> = ({ label, tone = "neutral", className, children, ...rest }) => (
    <Section className={classNames("kpi", className)} data-tone={tone} {...rest}>
        <div className="kpi-label">{label}</div>
        {children}
    </Section>
);

KpiComponent.displayName = "Kpi";

export const Kpi = Object.assign(KpiComponent, {
    Value: KpiValue,
    Sub: KpiSub,
});
