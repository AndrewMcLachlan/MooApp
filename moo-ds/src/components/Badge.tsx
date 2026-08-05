import classNames from "classnames";
import React from "react";
import { toneForegroundVar, toneVar, type Hue, type Tone, type Variant } from "../models/Colours";

/** @deprecated Use `Variant`. */
export type BadgeSemantic = Variant;

/** @deprecated Use `Hue`. */
export type BadgeHue = Hue;

/* The tokens with a class of their own below. Anything else — a hue an app has added to the
   palette — is resolved to its custom property instead, so it needs nothing from this stylesheet. */
const builtIn = new Set<string>([
    "primary", "secondary", "success", "danger", "warning", "info",
    "blue", "indigo", "purple", "pink", "rose", "orange", "amber", "yellow",
    "green", "emerald", "teal", "cyan", "slate", "neutral",
]);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Named token: a semantic variant or a hue. Ignored when `colour` is also supplied.
     */
    bg?: Tone;
    /**
     * Any CSS colour value. Overrides `bg` when provided.
     * Examples: "#7c6cff", "rgb(124,108,255)", "var(--brand-teal)".
     */
    colour?: string;
    /**
     * Optional foreground colour, used together with `colour` when the default doesn't suit
     * (e.g. light custom colours that need dark text). Ignored when `bg` is used alone.
     */
    textColour?: string;
    muted?: boolean;
    outline?: boolean;
    pill?: boolean;
    icon?: React.ReactNode;
}

type BadgeCssVars = React.CSSProperties & {
    "--badge-bg"?: string;
    "--badge-fg"?: string;
};

export const Badge = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<BadgeProps>>(
    ({ bg = "primary", colour, textColour, muted, outline, pill, icon, className, children, style, ...rest }, ref) => {
        const useCustom = !!colour;
        // A token this stylesheet has no class for is an app's own; resolve it to its custom
        // property so extending the palette is a CSS change rather than a component change.
        const useToken = !useCustom && !!bg && !builtIn.has(bg);

        let inlineStyle: BadgeCssVars | undefined = style;
        if (useCustom || useToken) {
            inlineStyle = { ...style, "--badge-bg": useCustom ? colour : toneVar(bg as Tone) };
            if (useToken) inlineStyle["--badge-fg"] = toneForegroundVar(bg as Tone);
            if (textColour) {
                inlineStyle["--badge-fg"] = textColour;
                // Muted and outline compute color via color-mix and don't read --badge-fg.
                // Set color directly so an explicit textColour wins in those variants too.
                inlineStyle.color = textColour;
            }
        }

        const classes = classNames(
            "badge",
            !useCustom && !useToken && bg && `bg-${bg}`,
            // outline wins when both supplied
            outline && "outline",
            muted && !outline && "muted",
            pill && "rounded-pill",
            icon && "with-icon",
            className,
        );

        return (
            <span ref={ref} className={classes} style={inlineStyle} {...rest}>
                {icon}
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";
