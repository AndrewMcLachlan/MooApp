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

## Loading states — spinner vs skeleton

The design system offers two loading affordances; pick by whether the placeholder can honestly mirror the final content:

- **`Skeleton`** (and the `loading` prop on `Table`, `SectionTable`, `DataGrid`, and `Button`) — use when the content has a **known, repeating shape**: table rows, lines of text, avatars, list items. The shimmering placeholder tells the eye where the real content will land. `Skeleton.Text`, `Skeleton.Circle`, and `Skeleton.Rect` compose the common shapes.
- **`Spinner` / `SpinnerContainer`** — use when the shape is **unknown or irregular**: charts, reports, arbitrary `Widget` bodies. A skeleton there would misrepresent the layout, so a spinner is the honest choice.

The skeleton shimmer is a single moving gradient that resolves its colours from the active theme and collapses to a static placeholder under `prefers-reduced-motion`. Skeleton shapes are decorative (`aria-hidden`); the loading *region* that contains them carries `aria-busy`.

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
