# MooApp — Code Quality Remediation Plan

_Companion to [`code-quality-findings.md`](./code-quality-findings.md). Item IDs (B#, P#) reference that document._

The work is organized into five phases, ordered by risk-reduction per unit of effort. Each phase is independently shippable. Phases 1–2 are near-zero-risk correctness fixes; phase 3 is a mechanical performance sweep; phases 4–5 are quality/hardening.

Every phase should end with `npm run build`, `npm run type-check`, and `npm run test:run` green, plus a new/updated test for each behavioural fix.

---

## Phase 1 — High-severity correctness (ship first)

Small, surgical, high-impact. No API changes except fixing an already-wrong type.

| Item | Change | Test to add |
|------|--------|-------------|
| **B1** `useApiDelete` | Return `.data`; correct the generic to `UseMutationResult<void, DefaultError, Variables>` (or actual payload type). | Assert `mutateAsync` resolves to the response body, not an `AxiosResponse`. |
| **B2** `usePageTitle` | Replace `useMemo` with `useEffect`; deps `[title, app.name]`. | Render, assert `document.title`; change `app.name`, assert update. |
| **B3** `dateOnly` | Zero-pad month/day. | `dateOnly(new Date(2026,6,3))` → `"2026-07-03"`. |
| **B4** `MessageProvider` | Functional `setMessages`/`clearMessages`. | Fire two `sendMessage` in one tick; assert both survive. |

**Risk:** B1 changes an observable return value — verify no consumer relied on the old `AxiosResponse`. Given the declared type was already `null`, no correctly-typed consumer can have.

---

## Phase 2 — Medium correctness bugs

Grouped by file to minimize churn.

**moo-ds components**
- **B5** `EditColumn` — `setValue(props.value)`, deps `[props.value]`.
- **B6** `CloseBadge` — `e.preventDefault()` instead of assigning `defaultPrevented`.
- **B7 + B8** `ComboBoxInput` — switch to `useDebouncedCallback` for real debouncing; lowercase both sides of the creatable check. (Also remove the commented-out `useLayoutEffect`, §4.)
- **B9** `NavItemList` — wrap the route-branch `onClick` as `(e) => onNavItemClick(e, navItem)`.
- **B10** `SortablePaginationTh` / `MiniPagination` — `stopPropagation()` on pagination button clicks.
- **B18** `Upload` — guard nullable `files`; decide `isDragging` (wire to a CSS class or remove).

**moo-ds hooks/utils/providers**
- **B12 + B13** `useStorage` — try/catch around `JSON.parse` with fallback; re-init on `key` change; optional `storage`-event listener for cross-tab sync.
- **B14** `Notifications` — guard `theme?.theme`.
- **B15** `nextSunday` — clone input, `setMilliseconds(0)`.
- **B16** `ThemeProvider` — move DOM read + `console.warn` into `useEffect`.
- **B17** `updatingState` — document/guard the reset-on-new-value behaviour and the function overload.
- **B19** `innerRef` — cleanup `ref(null)` for callback refs.

**moo-app**
- **B11** `processAxiosError` — optional-chain the response body.

**Tests:** each bug gets a focused regression test (most of these files already have `__tests__` siblings to extend).

---

## Phase 3 — Performance: memoize context values (mechanical sweep)

A single consistent pattern applied across all providers, plus the two hotspots. Low risk, high payoff (removes app-wide re-render cascades).

1. **P4** `LinkProvider`, **P5** `MessageProvider`, **P6** `ThemeProvider`, **P7** `LayoutProvider`, **P2** `ComboBoxProvider` — wrap each context `value` in `useMemo`; wrap handlers in `useCallback`.
2. **P1** `clickAway` — add the dependency array; stabilize the handler.
3. **P3** `ComboBoxProvider` — replace `JSON.stringify(items)` deps with a stable ref / id-key.
4. **P8** `Page` — memoize the arrays written into layout state (or compare content) so inline-literal callers stop triggering the storm. Best done **after** P7 so the fix can be verified against a memoized provider.

**Verification:** add a render-count assertion test (e.g. React Testing Library + a render counter) for at least `LayoutProvider`/`Page` to lock in the improvement and prevent regression.

---

## Phase 4 — Smells, typing & consistency

Batch these; none are behavioural except the console removals.

- Remove production logging: **`FormComboBox` `console.log`**, gate/soften `PaginationControls` `console.warn` (and add `PageIndicator` to its message).
- Extract a shared **`useApiMutation`** helper to collapse the 7-way `onErrorWrapper` duplication; fix **`useApiPut`** error type (`DefaultError`) and **`useApiGet` `total`** (`Number(...)`) in the process.
- Typing: `MooApp` MSAL instance → `IPublicClientApplication | null`; `clickAway` ref → `RefObject<HTMLElement>`; `useStorage` return reflects possible `undefined`; `LinkProvider` context `… | null`.
- Misc: `SortIcon` inline style → CSS class; `NavItemList` throw `Error`; `Notifications` CSS import path; `SectionForm` param mutation; `trimEnd` redundant condition; empty `MessageProviderProps`; `idParams` error message.
- `MooApp` effects — include the props they read in deps; guard the version `<meta>` against `undefined` and add cleanup to prevent duplicates.

---

## Phase 5 — Accessibility baseline

Design-system-level a11y is a quality investment that also strengthens the "opinionated components" story (see architecture plan).

- **Modal** — add `role="dialog"`, `aria-modal`, focus trap, Escape-to-close.
- **ComboBox** — correct `aria-expanded` to track open state; add `role="listbox"/"option"`, `aria-controls`; remove positive `tabIndex`; add keyboard selection.

These are larger; schedule after the correctness/perf phases land.

---

## Suggested sequencing & sizing

| Phase | Effort | Risk | Ship as |
|-------|--------|------|---------|
| 1 — High correctness | ~0.5 day | Very low | One PR |
| 2 — Medium bugs | ~1–1.5 days | Low | One PR (or split ds/app) |
| 3 — Provider memoization | ~0.5 day | Low | One PR |
| 4 — Smells/typing | ~1 day | Very low | One PR |
| 5 — A11y | ~1–2 days | Medium (behavioural) | Separate PR per component |

Recommended order: **1 → 3 → 2 → 4 → 5**. (Phase 3 is pulled forward because the memoization sweep is mechanical, low-risk, and delivers the most user-visible improvement; the medium bug fixes in Phase 2 then land on a calmer render baseline.)

Do **not** bundle these with unrelated feature work — each phase should be reviewable as a focused, test-backed change.
