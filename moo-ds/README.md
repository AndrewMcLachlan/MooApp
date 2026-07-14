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
