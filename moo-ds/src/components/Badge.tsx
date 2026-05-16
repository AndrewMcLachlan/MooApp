import classNames from "classnames";
import React from "react";

export type BadgeSemantic = "primary" | "secondary" | "success" | "danger" | "warning" | "info";

export type BadgeHue =
    | "blue" | "indigo" | "purple" | "pink" | "rose"
    | "orange" | "amber" | "yellow"
    | "green" | "emerald" | "teal" | "cyan"
    | "slate" | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Named token: a semantic variant or a hue. Ignored when `colour` is also supplied.
     */
    bg?: BadgeSemantic | BadgeHue;
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

        let inlineStyle: BadgeCssVars | undefined = style;
        if (useCustom) {
            inlineStyle = { ...style, "--badge-bg": colour };
            if (textColour) {
                inlineStyle["--badge-fg"] = textColour;
                // Muted and outline compute color via color-mix and don't read --badge-fg.
                // Set color directly so an explicit textColour wins in those variants too.
                inlineStyle.color = textColour;
            }
        }

        const classes = classNames(
            "badge",
            !useCustom && bg && `bg-${bg}`,
            // outline wins when both supplied
            outline && "badge-outline",
            muted && !outline && "badge-muted",
            pill && "rounded-pill",
            icon && "badge-with-icon",
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
