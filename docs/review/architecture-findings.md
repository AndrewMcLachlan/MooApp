# MooApp — Architectural Review

_Review date: 2026-07-13 · Scope: `@andrewmclachlan/moo-ds` and `@andrewmclachlan/moo-app` · Branch: `main`_

This review assesses how well each package delivers on its stated goal:

- **moo-ds** — an _opinionated design system_ with no auth dependencies.
- **moo-app** — a _complete, opinionated authenticated SPA framework_ built on moo-ds.

Findings focus on architecture (API surface, layering, extensibility, composition), not line-level bugs — those are in [`code-quality-findings.md`](./code-quality-findings.md). The remediation plan is in [`architecture-plan.md`](./architecture-plan.md).

---

## Overall verdict

**moo-ds — meets its "opinionated components" goal well (strong).** It owns a real design language (a ~55-file CSS system under `moo-ds/src/css/`, fixed variant palettes, baked component defaults), keeps a clean auth-free boundary, and applies compound-component and provider patterns consistently. Detractors are a _closed_ theme model, a hard FontAwesome coupling, and DS-level gaps in form-error and modal-a11y primitives — refinements, not structural problems.

**moo-app — partially meets its "complete opinionated framework" goal (mixed).** Provider wiring, data-fetching hooks, error boundary, and layout shell are genuinely turnkey and well-layered on moo-ds. But three issues hold it back from being _reusable_ rather than the author's personal scaffold:

1. **Authentication is hardcoded to a single Azure AD tenant** with no configuration seam (highest impact).
2. **No routing abstraction** despite an advertised (and now-missing) helper — consumers hand-assemble the whole route tree.
3. **`ThemeProvider` is mounted inside the authenticated-only layout**, so the theme seam doesn't cover the whole app.

**Priority order:** parameterize MSAL config → hoist `ThemeProvider` → restore a route helper (or fix the docs) → de-duplicate the model files → open the theme model → add form-error/modal-a11y primitives.

---

## 0. Documentation drift (foundational risk)

**CLAUDE.md and both package READMEs are stale and contradict the code.** This is called out first because it undermines the written contract of both packages and colours several findings below.

- CLAUDE.md describes moo-ds as "React Bootstrap-based" — there is **no `react-bootstrap` dependency**; the DS now ships its own Bootstrap-class-contract CSS under `moo-ds/src/css/`.
- CLAUDE.md describes moo-app routing as "React Router" with a `createMooAppBrowserRouter` utility. The code uses **`@tanstack/react-router`** (`moo-app/package.json:81`, `MooApp.tsx`), and **`createMooAppBrowserRouter` does not exist** (verified: zero references in the repo).
- Both package READMEs are identical stubs that also still say "React Router."
- Both `package.json` files carry the same `"description": "Base library for Moo-branded apps"` — inaccurate for moo-app.

---

## 1. API surface & consistency

**✅ Strength — consistent component conventions across moo-ds.** Nearly every component follows the same shape: `classnames` merge of base + variant + passthrough `className`, `forwardRef`, native-attribute spread, and a `displayName` (`Button.tsx`, `Table.tsx`, `Modal.tsx`, `DataGrid.tsx`). Predictable and composable.

**⚠️ Medium — moo-app leaks internal plumbing into its public API.** `HttpClientProvider.tsx` exports `createHttpClient` and `addMsalInterceptor` (imperative axios/MSAL helpers used internally by `msgraph.ts`) alongside the intended `HttpClientProvider`/`useHttpClient`. Consumers shouldn't need these. → Make them module-private or move to an `/internal` subpath.

**⚠️ Medium — inconsistent barrel hygiene around error utilities.** `services/index.ts` exports `msgraph` (so `usePhoto` is public) but **not** `errorHandler.ts` (`useErrorHandler`) or `processAxiosError.ts`. The framework's own error-to-toast handler and axios/ProblemDetails normalizer are unreachable by consumers even though clearly intended to be used. → Export them, or explicitly mark internal.

**⚠️ Low — duplicated `useErrorHandler`.** Byte-for-byte identical hook in both `moo-ds/src/hooks/errorHandler.ts` and `moo-app/src/services/errorHandler.ts`. The moo-app copy is redundant (and unexported). → Delete it; consume the DS one.

**⚠️ Low — uneven form sub-component surface.** `form/index.ts` re-exports `Select`, `Label`, `Password`, `TextArea`, `Group` as standalone top-level exports **and** as compound members (`Form.Select` etc.), while `Input`/`Check` are compound-only. The "form parts" surface is arbitrary. → Pick one convention (recommend compound-only).

---

## 2. Opinionatedness

**✅ Strength — moo-ds is genuinely opinionated, not a thin wrapper.** It owns a complete CSS design system (reset, variables, colours, grid, per-component styles), a fixed `Button` variant palette, and components ship baked defaults: `DataGrid` defaults `pageSizes=[10,20,50,100]`, `emptyMessage="No data available."`, `loadingRows=5`; `ComboBox` defaults `placeholder="Select..."`. Clearly meets the goal.

**✅ Strength — MooApp collapses a large provider stack into one component.** `MooApp.tsx` wires MSAL → HttpClient → React Query (optionally `PersistQueryClientProvider`) → Link → Message → Login → RouterProvider, with sensible `QueryClient` defaults (`offlineFirst`, `retry:false`, `refetchOnWindowFocus:false`). Provider boilerplate for consumers is low.

**🔴 High — authentication is hardcoded to the author's tenant.** `login/msal.ts:7` hardcodes `authority: "https://login.microsoftonline.com/30efefb9-…"` (a specific Azure AD tenant GUID), plus `cacheLocation` and `loginRequest.scopes`. `MooAppProps` accepts only `clientId`, `scopes`, `baseUrl`, and `getMsalInstance(clientId)` takes no config — **there is no way to set tenant/authority, redirect URIs, or cache without forking.** As published this is a personal scaffold, not a reusable framework. This is the single biggest gap against the "framework" goal.

**⚠️ Medium — hard FontAwesome coupling + import-time side effects.** moo-ds takes `@fortawesome/*` as peer deps, and `MooApp.tsx` runs `library.add(...)` at module load. Import-time global mutation is an opinion imposed on every consumer and complicates tree-shaking/testing.

---

## 3. Layering & coupling

**✅ Strength — dependency direction is clean and matches the goal.** moo-ds carries no auth dependencies (no MSAL/axios in `package.json`); moo-app declares moo-ds as a peer and builds on it. No circular/backwards deps. The `LinkProvider`/`useLink`/`useNavLink` inversion (`moo-ds/src/providers/LinkProvider.tsx`) is the right seam — the DS stays router-agnostic and moo-app injects TanStack `Link`/`NavLink` at the root. MSAL/axios stay encapsulated behind `HttpClientProvider` and the `useApi*` hooks; they don't leak into moo-ds.

**⚠️ Medium — duplicated model files across the package boundary.** `moo-app/src/models/App.ts` and `moo-app/src/models/Layout.ts` are **identical copies** of the moo-ds versions (`AppOptions`, `LayoutOptions`, `LayoutContext`, `size`), and both packages re-export them. The public surface therefore contains two structurally-identical-but-distinct copies of each type, which **will silently diverge**. `LayoutProvider.tsx` already imports `NavItem`/`useLocalStorage` from the DS, so the boundary is crossable. → moo-app should `export … from "@andrewmclachlan/moo-ds"` (or drop the duplicates).

---

## 4. Extensibility & customization

**✅ Strength — good customization seams exist.** Router injection (`LinkProvider`), persistent theming (`ThemeProvider` + `useLocalStorage`), toasts (`MessageProvider`), and layout slots (`Layout` compound + Mobile variants; `MooAppLayout` exposes `header`/`sidebar` props).

**🔴 High — `ThemeProvider` is mounted in the wrong place.** It's nested inside moo-app's `Layout` (`layout/Layout.tsx:27`), which only renders for authenticated users under `MooAppLayout`. The unauthenticated `authFallback`/`Login` screen and anything at the router root sit **outside** `ThemeProvider`, so `useTheme()` there falls back to the default context — no persistence, no setter. (This is likely why the documented provider hierarchy omits theming entirely.) → Hoist `ThemeProvider` into `MooApp`'s root provider stack.

**🔴 High — no routing abstraction; consumers hand-assemble everything.** With `createMooAppBrowserRouter` gone, the consumer writes the entire TanStack route tree by hand (`demoo/src/index.tsx` is ~150 lines of `createRoute`/`addChildren`). For a framework promising a "complete SPA" with "minimal boilerplate," routing is the roughest seam. → Reintroduce a route-definition helper, or document the raw-TanStack expectation and remove the stale claim.

**⚠️ Medium — the theme system is closed.** `moo-ds/src/models/Theme.ts` defines a fixed `Themes` string union (`"" | "dark" | "light" | "light red" | "dark blue"`) and a hardcoded array. Consumers can't register a custom brand theme/palette without editing DS source — unusually closed for a design system whose whole point is theming.

---

## 5. Composition patterns

**✅ Strength — the compound-component idiom is consistent and idiomatic.** `Object.assign`/namespace-property compounds with `displayName` are used uniformly: `Form.*`, `Modal.*`, `Section.*`, `Input.*`, `Layout.*`, and the `ComboBox` provider/container split. `DataGrid` cleanly composes the pagination/sortable primitives. Provider hooks consistently throw when used outside their provider (`useHttpClient`, `useApp`, `useMessages`, `useLink`) — one predictable pattern.

**⚠️ Low — mixed ref conventions.** Older components use `React.forwardRef` (`Button`, `Table`, `DataGrid`); newer ones take the React 19 `ref` prop directly (`ClearableInput.tsx`). Harmless but inconsistent now that React 19 is the floor.

**⚠️ Low — `Modal` enhances children by matching `displayName` strings** (`Modal.tsx` clones only `Modal.Header` to inject `onHide`). Consistent with the repo's documented displayName-based approach, but fragile to wrapping and silently no-ops if a consumer nests the header. A context-based `onHide` would be sturdier.

---

## 6. Gaps & risks

| Impact | Gap |
|--------|-----|
| Medium | **Form-validation story incomplete.** `Form` wires `react-hook-form` (`FormProvider`, `register`, `setValueAs`) but ships no error-display convention — no `FieldError`, no validation message in `Group`/`Label`. A DS built around RHF should ship the error-surface primitive. |
| Medium | **Modal a11y baseline thin.** Custom portal locks body scroll and closes on backdrop click, but lacks `role="dialog"`/`aria-modal`, focus trapping, Escape-to-close. |
| Low | **`usePageTitle` uses `useMemo` for a DOM side effect** — correctness smell in a public hook (also tracked as B2 in the quality findings). |
| Low | **Styling is all-or-nothing.** `moo-ds/src/index.ts` side-effect-imports `./css/mooapp.css`, so importing any component pulls the whole DS CSS. Acceptable/intended for a cohesive DS (JS still tree-shakes via ESM), but worth a conscious decision. |
| Low | **Documentation.** Per-package READMEs are identical stale stubs; real docs live only in Storybook. Combined with the stale CLAUDE.md, the written contract is unreliable (see §0). |

---

## Evidence index

Key files cited: `moo-ds/src/index.ts`, `moo-ds/src/css/`, `moo-ds/src/providers/LinkProvider.tsx`, `moo-ds/src/models/Theme.ts`, `moo-ds/src/models/{App,Layout}.ts`, `moo-ds/src/components/Modal.tsx`, `moo-ds/src/components/form/Form.tsx` + `form/index.ts`; `moo-app/src/MooApp.tsx`, `moo-app/src/login/msal.ts`, `moo-app/src/layout/Layout.tsx`, `moo-app/src/providers/HttpClientProvider.tsx`, `moo-app/src/services/index.ts`, `moo-app/src/models/{App,Layout}.ts`; `demoo/src/index.tsx`; `CLAUDE.md`; both `README.md` and `package.json`.
