import classNames from "classnames";
import React from "react";
import { Section } from "../layout/Section/Section";
import { toneVar, type Tone } from "../models/Colours";

export interface KpiProps extends React.HTMLAttributes<HTMLElement> {
    /** The small uppercase label above the figure. */
    label: React.ReactNode;
    /**
     * A colour token — a semantic variant, a hue, or one an app has added to the palette.
     * Colours the top bar and the figure. Overridden per-part by `colour` / `textColour`.
     */
    tone?: Tone;
    /**
     * An explicit colour for the top bar, for the rare case that has no token. Prefer adding a
     * `--hue-*` token and naming it, so light and dark are handled in one place.
     */
    colour?: string;
    /** An explicit colour for the figure. Same caveat as `colour`. */
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
 * The colour is set as custom properties on the element rather than through a class per token,
 * so a token an app has added to the palette works exactly as a built-in one does, and neither
 * depends on the app's stylesheet winning against this package's.
 *
 * Type sizes are deliberately absent from the component's own CSS — a KPI strip in a page header
 * and one in a dashboard want different scales — so the consumer sets those against the container
 * around the cards.
 */
const KpiComponent: React.FC<React.PropsWithChildren<KpiProps>> = ({ label, tone, colour, textColour, className, children, style, ...rest }) => {

    let inlineStyle: KpiCssVars | undefined = style;

    if (tone || colour || textColour) {
        inlineStyle = { ...style };

        if (tone) {
            inlineStyle["--kpi-bar"] = toneVar(tone);
            inlineStyle["--kpi-fg"] = toneVar(tone);
        }

        if (colour) inlineStyle["--kpi-bar"] = colour;
        if (textColour) inlineStyle["--kpi-fg"] = textColour;
    }

    return (
        <Section className={classNames("kpi", className)} style={inlineStyle} {...rest}>
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
