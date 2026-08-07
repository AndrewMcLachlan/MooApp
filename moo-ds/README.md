# @andrewmclachlan/moo-ds

An opinionated React design system — the foundation UI layer for MooApp, with **no authentication dependencies**.

![Build](https://github.com/andrewmclachlan/mooapp/actions/workflows/build.yml/badge.svg)

## What it provides

- **Components** — buttons, forms (built on `react-hook-form`), tables, `DataGrid`, pagination, modals, badges, alerts, avatars, and the `ComboBox` compound component.
- **A CSS design system** under `src/css/` — a reset, design tokens/variables, colours, grid, and per-component styles. It follows a Bootstrap class contract but has **no `react-bootstrap` dependency**. Importing the package pulls in `src/css/mooapp.css`.
- **Layout primitives** — `Section` (compound), `Alerts`, `Notifications`.
- **Providers for customization**:
  - `ThemeProvider` — persistent light/dark/brand theming. Themes are **extensible**: pass a `themes` list to register custom brand themes (the built-ins are the default).
  - `LinkProvider` — inject your router's `Link`/`NavLink` so the DS stays router-agnostic.
  - `MessageProvider` — toast/notification messages.
- **Utility hooks** — `useLocalStorage`, `useSessionStorage`, `useClickAway`, `useUpdatingState`, and more.

## Loading states — spinner vs skeleton vs progress bar

The design system offers three loading affordances. Pick by what is on screen already, then by whether a placeholder can honestly mirror the final content:

- **`Skeleton`** (and the `loading` prop on `Table`, `SectionTable`, `DataGrid`, and `Button`) — use when the content has a **known, repeating shape**: table rows, lines of text, avatars, list items. The shimmering placeholder tells the eye where the real content will land. `Skeleton.Text`, `Skeleton.Circle`, and `Skeleton.Rect` compose the common shapes. `Skeleton.Chart` covers charts — `bar`, `horizontal-bar`, `line`, `pie`, `doughnut`, with `count` for bars, series lines, or slices. It draws the elements plus a baseline axis and nothing else: legends and tick labels can't be guessed from outside the chart's own config, and furniture that turns out wrong is worse than none.
- **`Spinner` / `SpinnerContainer`** — use when the shape is **unknown or irregular**: reports, arbitrary `Widget` bodies, anything whose layout you can't predict. A skeleton there would misrepresent the layout, so a spinner is the honest choice. Charts are no longer in this group — reach for `Skeleton.Chart` instead.
- **`ProgressIndeterminate`** — use when the panel **already has data on screen** and is refetching. A thin line on the panel's top edge, with the stale body dimmed rather than replaced. Swapping visible content for a spinner throws away information the user was reading; this is the pattern that avoids it.

For a widget that fetches, that ladder runs: nothing under ~300ms → `Skeleton` / `Skeleton.Chart` (or `SpinnerContainer`, if the shape really is unpredictable) on first load → `ProgressIndeterminate` on every refetch after that.

`Spinner` defaults to the `comet` animation — a conic-gradient tail masked into a ring, turning once a second. `border` (the Bootstrap-derived gap ring) remains available via the `animation` prop. It also waits `delay` ms (300 by default) before painting, so sub-300ms fetches never flash one; pass `delay={0}` to render immediately, as `Button` and `IconButton` do — a button's busy state is direct feedback on a click.

`Widget` exposes both states: `loading` (no data yet — the body is replaced by a placeholder) and `refreshing` (data on screen — an edge bar plus a dimmed, still-mounted body). `loading` wins if both are set.

`loading` on its own gives a centred `SpinnerContainer`. Add `loadingPlaceholder` to substitute your own, which is how a chart widget gets a skeleton instead of a spinner:

```tsx
<Widget header="Top Tags" size="single"
        loading={isPending}
        loadingPlaceholder={<Skeleton.Chart variant="bar" count={10} />}
        refreshing={!isPending && isFetching}>
    <Bar data={data} options={options} />
</Widget>
```

Omitting `loadingPlaceholder` gives the spinner. Supplying one means it is *always* used: a value that evaluates to `false` renders nothing rather than reverting to a spinner. The point of a skeleton is to replace the spinner, not to replace it sometimes — a widget whose loading style changes with state the caller wasn't thinking about is worse than either choice made consistently.

That matters most when `loading` is broader than the placeholder's own condition. This shows a skeleton on first load and a *spinner* on every refetch, which is almost certainly not what was meant:

```tsx
loading={isLoading || isFetching}
loadingPlaceholder={isLoading && <Skeleton.Chart variant="bar" />}   // don't
```

Keep the placeholder unconditional — it is only consulted while `loading` — and use `refreshing` for refetches.

The skeleton shimmer is a single moving gradient that resolves its colours from the active theme and collapses to a static placeholder under `prefers-reduced-motion`. Skeleton shapes are decorative (`aria-hidden`); the loading *region* that contains them carries `aria-busy`. `ProgressIndeterminate` is a `role="progressbar"` with `aria-busy` and no `aria-valuenow`; under `prefers-reduced-motion` it renders as a static full-width bar. The comet spinner slows to 2s rather than stopping — a stopped spinner reads as a hang.

## Peer dependencies

- `react` and `react-dom` (>= 19.2.7)
- `react-hook-form` (>= 7.81) — the form components are built on it
- FontAwesome (`@fortawesome/fontawesome-svg-core`, `@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`) for the icon layer

## Usage

```tsx
import { Button, ThemeProvider } from "@andrewmclachlan/moo-ds";

<ThemeProvider>
  <Button variant="primary">Click me</Button>
</ThemeProvider>
```

For the full authenticated application framework built on top of this package, see [`@andrewmclachlan/moo-app`](../moo-app/README.md).
