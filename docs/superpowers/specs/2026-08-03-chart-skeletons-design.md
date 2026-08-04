# Chart skeletons — design

**Date:** 2026-08-03
**Package:** `@andrewmclachlan/moo-ds`

## Problem

`moo-ds` has `Skeleton.Text`, `Skeleton.Circle` and `Skeleton.Rect`, but nothing for a
chart. Consuming apps (MooBank) draw charts with **Chart.js**, which renders into a
`<canvas>` and paints *nothing* — no axes, no legend, no plot frame — until it has data.
For the whole of the wait there is an empty box.

The loading ladder in `moo-ds/README.md` says to reach for a skeleton when the
placeholder can honestly mirror the real layout. A chart panel on first load is exactly
that case, and it is the one rung the design system cannot currently serve.

## Constraint that shapes the design

`moo-ds` has no chart components and cannot see the consumer's chart config. Legend
presence, tick counts, axis-label widths and gridlines all vary per chart — within a
single dashboard, even. Any furniture the skeleton hardcodes is a guess, and a wrong
guess is worse than none: the panel still reflows when the real chart lands, *and* it
spent the wait implying a shape that never arrived.

So the skeleton draws only what is invariant across every chart of a given shape: the
elements themselves, plus a baseline axis where one always exists.

## Component

New file `moo-ds/src/components/SkeletonChart.tsx`, attached to the existing compound in
`Skeleton.tsx`. Kept separate so `Skeleton.tsx` stays small.

```tsx
export type SkeletonChartVariant = "bar" | "horizontal-bar" | "line" | "pie" | "doughnut";

export interface SkeletonChartProps extends React.HTMLAttributes<HTMLElement> {
    /** Shape to stand in for. Defaults to "bar". */
    variant?: SkeletonChartVariant;
    /** Bars, series lines, or slices. Defaults to 6 — 2 for "line". */
    count?: number;
}
```

`count` maps per variant:

| Variant | `count` means | Default |
| --- | --- | --- |
| `bar` | bars | 6 |
| `horizontal-bar` | bars | 6 |
| `line` | series lines | 2 |
| `pie` | slices | 6 |
| `doughnut` | slices | 6 |

The default is variant-aware because six bars is sensible and six overlaid lines is a
mess.

## Rendering

### bar / horizontal-bar

Root is a flex container; `count` shimmering `.skeleton` children are the bars. The
baseline is a border on the root — `border-bottom` for `bar`, `border-left` for
`horizontal-bar` — in `var(--border-colour)`.

```tsx
<span className="skeleton-chart skeleton-chart-bar" aria-hidden="true">
    <span className="skeleton skeleton-chart-element" />   {/* × count */}
</span>
```

Bar sizes come from an **8-step `nth-child` cycle in CSS** — `62% 88% 45% 70% 34% 95%
52% 78%` — repeating past 8 via `nth-child(8n + k)`. `height` for `bar`, `width` for
`horizontal-bar`.

Deterministic, not random: randomness would break SSR hydration and make snapshots
flicker. Deliberately **not** sorted descending — a generic skeleton must not imply the
consumer's chart sorts its data.

### line

Root is a `position: relative` container over the same `border-bottom` baseline. `count`
absolutely positioned `.skeleton` children each fill the plot area and are cut down to a
thin polyline by `clip-path`, from a **4-step `nth-child` cycle**.

Each polygon walks six points left-to-right along the top edge of the stroke, then back
right-to-left along the bottom edge at `+5%`, giving a stroke of even thickness:

```css
/* 1 */ polygon(0% 62%, 20% 44%, 40% 58%, 60% 28%, 80% 46%, 100% 22%,
                100% 27%, 80% 51%, 60% 33%, 40% 63%, 20% 49%, 0% 67%)
/* 2 */ polygon(0% 35%, 20% 52%, 40% 40%, 60% 62%, 80% 48%, 100% 70%,
                100% 75%, 80% 53%, 60% 67%, 40% 45%, 20% 57%, 0% 40%)
/* 3 */ polygon(0% 78%, 20% 66%, 40% 72%, 60% 50%, 80% 58%, 100% 38%,
                100% 43%, 80% 63%, 60% 55%, 40% 77%, 20% 71%, 0% 83%)
/* 4 */ polygon(0% 48%, 20% 30%, 40% 50%, 60% 38%, 80% 66%, 100% 54%,
                100% 59%, 80% 71%, 60% 43%, 40% 55%, 20% 35%, 0% 53%)
```

### pie / doughnut

No children and no axis — the root itself carries `.skeleton` and *is* the shimmering
disc:

```tsx
<span
    className="skeleton skeleton-chart skeleton-chart-doughnut skeleton-chart-count-6"
    aria-hidden="true"
/>
```

Slice gaps and the doughnut hole are **cut by composited masks** rather than painted with
divider lines, so the shape sits correctly on any background instead of assuming
`--section-bg`:

```css
-webkit-mask: radial-gradient(farthest-side, transparent var(--skeleton-chart-hole), #000 0),
              repeating-conic-gradient(#000 0 calc(var(--slice-angle) - 2deg), transparent 0 var(--slice-angle));
        mask: radial-gradient(farthest-side, transparent var(--skeleton-chart-hole), #000 0),
              repeating-conic-gradient(#000 0 calc(var(--slice-angle) - 2deg), transparent 0 var(--slice-angle));
-webkit-mask-composite: source-in;
        mask-composite: intersect;
```

`--skeleton-chart-hole` is `0` for `pie` and `55%` for `doughnut`. Same masking
technique as `.spinner-comet`, with the `-webkit-` prefix emitted alongside for Safari.

`--slice-angle` is the one place `count` must reach CSS. Project rules forbid inline
`style` attributes, so the component emits a `skeleton-chart-count-{n}` class for `n` in
**2–12** (clamped), each setting `--slice-angle: calc(360deg / n)`. Eleven small rules;
contained, and it keeps the rule intact.

## Sizing

Fills its container like a responsive Chart.js canvas: `width: 100%; height: 100%`, with
`min-height: 12rem` so it cannot collapse in an auto-height parent — the trap
`.spinner-container` hit inside a non-dashboard `Widget`.

`pie` and `doughnut` additionally get `aspect-ratio: 1`, centred and capped by the
available height so they stay circular.

## Accessibility

`aria-hidden="true"`, matching every other skeleton part: skeletons render in bulk, so
the loading *region* owns the single `aria-busy` announcement, not each shape.

The shimmer is inherited from the existing `.skeleton` class, so
`prefers-reduced-motion` already degrades to the opacity pulse with no extra work.

## Files

**New**
- `moo-ds/src/components/SkeletonChart.tsx`
- `moo-ds/src/css/components/_skeleton-chart.css`
- `moo-ds/src/components/__tests__/SkeletonChart.test.tsx`
- `storybook/src/stories/components/SkeletonChart.stories.tsx`

**Changed**
- `moo-ds/src/components/Skeleton.tsx` — attach `Chart` to the compound
- `moo-ds/src/css/_components.css` — register the new file (alphabetical)
- `demoo/src/routes/feedback/Loading.tsx` — sample of all five variants

## Demo

A static showcase on the existing Feedback → Loading page: all five variants, rendered
permanently in their loading state. No toggle, no timer, no chart to swap to.

demoo gains **no chart dependency**. The consequence is deliberate and worth stating:
the demo shows what each variant *looks like*, but does not exercise the claim that a
skeleton holds the panel's footprint so nothing jumps when the real chart lands. That
needs a real Chart.js canvas to toggle against, and verifying it stays with the
consuming app.
- `moo-ds/README.md` — name `Skeleton.Chart` in the loading ladder

## Testing

- Root carries `aria-hidden="true"`
- Defaults to `bar` with 6 children
- `line` defaults to 2 children
- `count` controls child count for `bar`, `horizontal-bar`, `line`
- `pie` / `doughnut` render no children and carry `skeleton-chart-count-{n}`
- Slice count clamps to 2–12; `count` below 0 renders no children rather than throwing
- `className` passes through; `displayName` is `Skeleton.Chart`

## Out of scope

- Legend and tick-label placeholders — not guessable from outside the consumer's chart
  config, and wrong furniture is worse than none (see *Constraint* above).
- Any Chart.js dependency or integration, in `moo-ds` **or** in demoo. This is a pure-CSS
  placeholder; neither package gains a new dependency.
- Any skeleton-to-chart transition demo, and with it any in-repo check that the skeleton
  and the real chart occupy the same box (see *Demo*).
