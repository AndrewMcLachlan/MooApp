# demoo curated showcase — design

**Date:** 2026-07-22
**Status:** Approved (pending spec review)

## Goal

Reorganise demoo from a grab-bag of demo routes into a coherent, curated
showcase of moo-ds / moo-app / moo-icons. demoo remains **internal and
dev-facing**; Storybook stays the only published documentation site. Keep it
lean — no prose beyond short blurbs, no code snippets, no prop tables.

## Role split

- **demoo** — components shown *in a real app frame*, with realistic data and
  in-context samples (in a table cell, in a form, in the shell). Every
  moo-ds/moo-app component eventually gets a sample here (standing rule).
- **Storybook** — isolated per-component reference: states, props, code.

## Information architecture

Primary sidebar = 8 category entries. Secondary nav (below the divider) =
pages within the active category. Tabs only as a last resort; none planned.

| Category | Pages (secondary nav) | Absorbs today's routes |
|---|---|---|
| Home | — (landing/dashboard) | `Home.tsx` unchanged — the dashboard *is* the Widget/Row/Collapsible showcase |
| Layout | Page & Sections · Navigation (Breadcrumb, Nav, Tab) · Drawer | parts of `Components.tsx` |
| Forms | Form · Inputs · Buttons · ComboBox · TagPanel · Upload | `form/`, `ComboBox.tsx`, TagPanel |
| Data & Tables | Table · DataGrid · Pagination | `Table.tsx`, `DataGrid.tsx` |
| Feedback | Alerts & Messages · Notifications · Loading (Spinner, Skeleton, SpinnerContainer) · Badges | `Notifications.tsx`, `Skeleton.tsx`, parts of Home/Components |
| Overlays | — (single page: Modal, Popover, Tooltip) | `Overlays.tsx` |
| Icons | — (single page: gallery + Icon component) | `Icons.tsx` |
| App framework | Providers & Theming · Error handling | `Providers.tsx`, `ErrorPage.tsx` |

Notes:

- **Buttons** live on a Buttons page under Forms: Button, ButtonGroup,
  IconButton, IconLinkButton, LinkBox, and the icon actions (ClickableIcon,
  DeleteIcon, SaveIcon). The Icons category holds only the gallery and the
  `Icon` component.
- **Profile** stays a user-menu route (not in the sidebar) — it demonstrates
  the user-menu pattern itself.
- `Components.tsx` is dissolved into the categories and deleted.
- Single-page categories skip secondary nav until they grow.

## Nav mechanics

- Routes nest by category: `/forms/combo-box`, `/data/table`,
  `/feedback/loading`, …
- Each multi-page category gets a **TanStack layout route** whose component
  sets `secondaryNav` via `useLayout()` on mount (clearing on unmount) and
  renders an `<Outlet />`. Page lists are defined once per category;
  individual pages stay ignorant of nav. This is the first real dogfood of
  `secondaryNav`.
- A category's primary nav entry routes to its first page (plain redirect —
  no category landing pages).
- Single-page categories route straight to the page, no layout route.

## Page convention

Follow the shape `ComboBox.tsx` already has:

- `<Page title breadcrumbs>`, breadcrumbs reflecting category → page.
- One `<Section>` per component (or per scenario for large components),
  `headerSize={4}`.
- A one-or-two-sentence `<p>` blurb: what the component is for, when to use
  it.
- Live sample with realistic data (the existing Tag/account/finance flavour),
  including at least one in-context sample where it matters.
- No code snippets, no prop tables.
- No inline styles — CSS classes only (repo rule). Existing demos that use
  inline styles get cleaned up as they move.

## Migration & scope

- **Structure first:** this effort builds the category/route skeleton and
  re-homes all existing demos. Missing-component samples are follow-up
  branches; stub sections only where trivial.
- `App.tsx` sidebar shrinks to the 8 category entries with sensible icons.
- Out of scope: anything published/public, Storybook changes, new moo-ds
  features.
- Exception: rough edges found while dogfooding `secondaryNav` (or the layout
  shell generally) are in scope to fix — surfacing those is demoo's job.

## Testing

- demoo has no meaningful test suite; correctness is visual. Verify by
  running the dev server and walking each category.
- moo-ds/moo-app test suites must stay green (only demoo and any dogfood
  fixes touch library code).
