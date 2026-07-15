# MooApp — Architecture Improvement Plan

_Companion to [`architecture-findings.md`](./architecture-findings.md)._

The goal of this plan is to move **moo-app from "the author's personal scaffold" to a genuinely reusable framework**, and to close the remaining refinement gaps in **moo-ds** — without disrupting the parts that already work well (clean layering, consistent component conventions, low provider boilerplate).

Work is grouped into four milestones by theme and dependency order. Milestone 1 unblocks external adoption and should ship first. Each item notes whether it is a **breaking** change (needs a major/minor bump per the project's GitVersion flow).

---

## Milestone 1 — Make moo-app actually reusable (highest impact)

These three items are what separate a framework from a scaffold.

### 1.1 Parameterize MSAL configuration _(breaking-ish; additive if defaulted)_
**Problem:** `login/msal.ts:7` hardcodes the tenant authority; `getMsalInstance(clientId)` and `MooAppProps` expose no way to set authority/redirect/cache.

**Approach:**
- Extend `MooAppProps` with an optional `auth` object — e.g. `authority`, `redirectUri`, `postLogoutRedirectUri`, `cacheLocation`, and/or an escape-hatch `msalConfig?: Partial<Configuration>` that deep-merges over the defaults.
- Thread it through `getMsalInstance(clientId, authOptions)` instead of mutating a module-level `msalConfig` singleton (the current mutate-then-create pattern is also a latent bug if called with different args).
- Keep the current values as **defaults** so existing consumers are unaffected.
- Similarly allow `loginRequest.scopes` / `apiRequest` scopes to be supplied.

**Test:** instantiate `MooApp` with a custom authority; assert the MSAL instance is configured with it.

### 1.2 Restore a routing abstraction — or correct the contract _(non-breaking)_
**Problem:** `createMooAppBrowserRouter` is advertised (CLAUDE.md) but does not exist; consumers hand-build the full TanStack route tree (`demoo/src/index.tsx`, ~150 lines).

**Decision required (pick one):**
- **(A) Reintroduce a helper** — a `createMooAppRouter(routeDefs)` that maps a declarative route-definition array (matching moo-ds `NavItem`/route models) into a TanStack route tree, wiring the app-shell layout route automatically. Highest value, most effort.
- **(B) Document the raw-TanStack expectation** — remove the stale claim, add a documented, copy-pasteable router setup recipe, and ship a small `demoo`-style template.

Recommend **(A)** if reuse is a real goal; **(B)** as the minimum to remove the false promise.

### 1.3 Hoist `ThemeProvider` to the app root _(non-breaking; bug-fix)_
**Problem:** `ThemeProvider` sits inside `layout/Layout.tsx:27`, so unauthenticated/`Login`/router-root content has no theme context, persistence, or setter.

**Approach:** move `ThemeProvider` into `MooApp`'s root provider stack (above the auth split), and remove it from `Layout`. Verify the documented provider hierarchy is updated to include it.

**Test:** render the unauthenticated `Login` path; assert `useTheme()` returns the persisted theme and a working `setTheme`.

---

## Milestone 2 — Tighten the package boundary & public API

Removes divergence risk and internal leakage.

### 2.1 De-duplicate the shared model files _(breaking: type identity change)_
`moo-app/src/models/{App,Layout}.ts` are identical copies of the moo-ds versions. Replace them with `export … from "@andrewmclachlan/moo-ds"` (or drop them and import directly), so there is one canonical `AppOptions`/`LayoutOptions`/`LayoutContext`/`size`.

### 2.2 Stop leaking internal plumbing _(breaking: removes exports)_
Make `createHttpClient` and `addMsalInterceptor` module-private (or move to an `/internal` entry). Keep `HttpClientProvider`/`useHttpClient` public.

### 2.3 Fix barrel hygiene for error utilities _(non-breaking: adds exports)_
Export `useErrorHandler` and `processAxiosError` from `services/index.ts` (they're framework-intended), **or** deliberately mark them internal — but be consistent. Then delete the duplicate `moo-app/src/services/errorHandler.ts` and consume the moo-ds `useErrorHandler`.

### 2.4 Settle the form sub-component surface _(breaking: removes top-level exports)_
Pick one convention. Recommend **compound-only** (`Form.Select`, `Form.Label`, …) and drop the standalone top-level re-exports of `Select`/`Label`/`Password`/`TextArea`/`Group` from `form/index.ts`.

### 2.5 Standardize ref conventions _(non-breaking)_
Now that React 19 is the floor, converge on the `ref`-as-prop style; migrate the `forwardRef` components opportunistically (no rush — cosmetic).

---

## Milestone 3 — Open up the opinionated surfaces

Make the design system extensible without forking.

### 3.1 Open the theme model _(non-breaking if additive)_
`moo-ds/src/models/Theme.ts` hardcodes the `Themes` union and array. Allow consumers to register additional themes/palettes — e.g. accept a themes list via `ThemeProvider` props and/or widen the type to `string` with a provided registry. Preserve the built-ins as defaults.

### 3.2 Reconsider FontAwesome coupling & import-time side effects _(potentially breaking)_
`MooApp.tsx` runs `library.add(...)` at module load. Move icon registration into an effect or an explicit opt-in setup call so importing the package has no global side effect, and consider making the icon layer pluggable rather than a hard `@fortawesome/*` peer.

### 3.3 Make CSS import a conscious decision _(non-breaking; document)_
`moo-ds/src/index.ts` side-effect-imports the whole design-system CSS. Document this as intentional (cohesive DS) or offer a styles-less entry point for consumers who want to import CSS separately. At minimum, record the decision.

---

## Milestone 4 — Fill the design-system gaps

Primitives a mature opinionated DS is expected to ship.

### 4.1 Form-error surface _(non-breaking: additive)_
`Form` already wires react-hook-form. Add the missing error-display primitive(s): a `Form.FieldError` component and/or validation-message rendering in `Group`/`Label`, following the existing compound-component idiom.

### 4.2 Modal accessibility baseline _(non-breaking; behavioural)_
Add `role="dialog"`, `aria-modal`, focus trapping, and Escape-to-close to `Modal.tsx`. Consider a context-based `onHide` to replace the fragile displayName-string cloning. (Overlaps with Phase 5 of the code-quality plan — do it once.)

### 4.3 ComboBox accessibility _(non-breaking; behavioural)_
Correct `aria-expanded`, add `role="listbox"/"option"` + `aria-controls`, remove positive `tabIndex`, add keyboard selection. (Also overlaps the code-quality plan.)

---

## Documentation (cross-cutting — do alongside Milestone 1)

Because the written contract is currently unreliable, refresh docs **as each milestone lands**, not at the end:

- Correct **CLAUDE.md**: TanStack Router (not React Router), no React Bootstrap dependency, remove/replace the `createMooAppBrowserRouter` reference per decision 1.2.
- Replace the identical stub **READMEs** with per-package content (distinct descriptions in `package.json` too).
- Document the **provider hierarchy** accurately once `ThemeProvider` is hoisted (1.3).

---

## Sequencing & impact

| Milestone | Theme | Breaking? | Priority |
|-----------|-------|-----------|----------|
| 1.3 Hoist ThemeProvider | Bug-fix | No | **Do first** (small, high value) |
| 1.1 MSAL config | Framework | Additive-if-defaulted | **First release** |
| 1.2 Routing | Framework | No | First release |
| 2.1–2.4 Boundary/API | Hygiene | Some breaking | Batch into next minor/major |
| 3.x Open surfaces | Extensibility | Mixed | Following release |
| 4.x DS gaps | Completeness | Additive | Incremental |

**Recommended first PR:** 1.3 (ThemeProvider hoist) + the CLAUDE.md/README doc corrections — small, non-breaking, immediately removes two of the most visible defects. Then tackle 1.1 + 1.2 together as the "reusability" release, coordinating the version bump per the repo's GitVersion tagging convention.

Group breaking API changes (Milestone 2) into a single deliberate version bump rather than dribbling them out.
