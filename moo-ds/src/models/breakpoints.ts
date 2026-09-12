/**
 * The widths the stylesheet's `@media` blocks and `d-{tier}-*` utilities use.
 * Exported so a consuming app never restates one: a number written twice is a
 * number that drifts, and a layout that switches at one width while its content
 * switches at another looks like neither.
 */
export const breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1500,
    fhd: 1880,
    qhd: 2520,
    uhd: 3200,
} as const;

export type Breakpoint = keyof typeof breakpoints;
