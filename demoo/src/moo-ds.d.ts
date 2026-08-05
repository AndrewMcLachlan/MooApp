/**
 * Colour tokens of demoo's own.
 *
 * This is the half of adding a tone that TypeScript needs: registering the names makes them
 * first-class values of `Hue`, so `tone="income"` type-checks and autocompletes with no cast.
 * The other half is CSS — the colours and the rule that wires them to the card — in App.css.
 */
declare module "@andrewmclachlan/moo-ds" {
    interface HueRegistry {
        income: true;
        expense: true;
    }
}

export { };
