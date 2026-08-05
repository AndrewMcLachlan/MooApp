/**
 * Colour tokens.
 *
 * A token is only a name. The colour behind it lives in CSS, so adding one is a CSS change and
 * nothing has to be declared to TypeScript first — `Tone` accepts any name, and the built-in ones
 * still autocomplete.
 */

/** Semantic variants: what a thing means, rather than what colour it is. */
export type Variant =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";

/** Hues: a colour chosen for identity — categories, series, tags — where no meaning is implied. */
export type Hue =
    | "blue" | "indigo" | "purple" | "pink" | "rose"
    | "orange" | "amber" | "yellow"
    | "green" | "emerald" | "teal" | "cyan"
    | "slate" | "neutral";

/**
 * Anywhere a component takes "a colour by name": a variant, a hue, or one of your own.
 *
 * The `string & {}` keeps the built-in names in autocomplete while leaving the type open, so an
 * app names its own tone and writes the rule for it, with nothing to register.
 */
export type Tone = Variant | Hue | (string & {});
