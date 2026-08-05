/**
 * Colour tokens.
 *
 * Both lists are registry interfaces rather than plain unions so an application can add its own
 * tokens by declaration merging, and still get autocomplete and typo-checking on them:
 *
 * ```ts
 * declare module "@andrewmclachlan/moo-ds" {
 *     interface HueRegistry {
 *         income: true;
 *         expense: true;
 *     }
 * }
 * ```
 *
 * A token is only a name. The colour behind it is a `--hue-<name>` custom property, so an app
 * defines its own in CSS — with `light-dark()`, like the built-in hues — and never puts a colour
 * value in a component call.
 */

/** Semantic variants: what a thing means, rather than what colour it is. */
export interface VariantRegistry {
    primary: true;
    secondary: true;
    success: true;
    warning: true;
    danger: true;
    info: true;
}

export type Variant = keyof VariantRegistry;

/** Hues: a colour chosen for identity — categories, series, tags — where no meaning is implied. */
export interface HueRegistry {
    blue: true;
    indigo: true;
    purple: true;
    pink: true;
    rose: true;
    orange: true;
    amber: true;
    yellow: true;
    green: true;
    emerald: true;
    teal: true;
    cyan: true;
    slate: true;
    neutral: true;
}

export type Hue = keyof HueRegistry;

/** Anywhere a component takes "a colour by name", it takes either. */
export type Tone = Variant | Hue;

/** The custom property holding a token's colour. Apps define their own to extend the palette. */
export const toneVar = (tone: Tone) => `var(--hue-${tone})`;

/** The readable foreground for a token, where one is painted on top of it. */
export const toneForegroundVar = (tone: Tone, fallback = "#fff") => `var(--hue-${tone}-fg, ${fallback})`;
