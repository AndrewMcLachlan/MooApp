# MooApp — Code Quality Findings

_Audit date: 2026-07-13 · Scope: `moo-ds/src` and `moo-app/src` (excluding tests) · Branch: `main`_

This document records **verified** defects — bugs, performance issues, dead code, and code smells — found by reading the source. Every High/Medium item below was confirmed by direct inspection of the cited file and line. A companion remediation plan is in [`code-quality-plan.md`](./code-quality-plan.md).

> **Note on "dead code":** These are libraries. Any symbol exported from a package barrel (`index.ts`) is public API and is **not** treated as dead code even if unused internally. Genuinely dead code found was minimal (see §4).

## Severity summary

| Severity | Count | Theme |
|----------|-------|-------|
| High     | 4     | Wrong return values / impure render / malformed output |
| Medium   | 17    | Correctness bugs + provider re-render storms |
| Low      | ~18   | Smells, typing, a11y, minor edges |

---

## 1. Bugs / correctness

### High

| # | Location | Problem | Fix |
|---|----------|---------|-----|
| B1 | `moo-app/src/services/useApiDelete.ts:6,18,21` | `mutationFn` returns `httpClient.delete(...)` — the full `AxiosResponse`, not `.data` — while declared to resolve `null`. Every other verb hook returns `.data`. The public signature also returns `UseMutationResult<Response, …>`, referencing the global DOM `Response` type (no such generic exists here). | `return (await httpClient.delete(path(variables))).data;` and fix the generic to `UseMutationResult<void, DefaultError, Variables>` (or the actual payload type). |
| B2 | `moo-app/src/hooks/pageTitle.ts:8` | Side effect (`document.title = …`) runs **inside `useMemo`**, which React may discard/re-run at will — impure render, breaks under StrictMode/concurrent. Dependency array omits `app.name`, so the title never updates when the app name changes. | Use `useEffect(() => { document.title = \`${title} : ${app.name}\`; }, [title, app.name])`. |
| B3 | `moo-ds/src/utils/dateHelpers.ts:1` | `dateOnly` does not zero-pad month/day → `2026-7-3` instead of `2026-07-03`. Feeds `toUrl` (line 22), producing non-ISO, non-sortable URL path segments. | Pad: `String(date.getMonth()+1).padStart(2,"0")` and the same for `getDate()`. |
| B4 | `moo-ds/src/providers/MessageProvider.tsx:13-20` | `sendMessage`/`clearMessage` read the `messages` closure and pass a fresh array to `setMessages`. Two calls in the same tick (or send-after-clear) operate on the same stale snapshot and lose an update. | Use functional updates: `setMessages(prev => [...prev.filter(m => m.key !== message.key), message])`. |

### Medium

| # | Location | Problem | Fix |
|---|----------|---------|-----|
| B5 | `moo-ds/src/components/EditColumn.tsx:22-24` | Prop-sync effect calls `setValue(value)` (current state) instead of `setValue(props.value)`, and omits `value` from deps → the input shows a stale value after a data refresh. | `setValue(props.value)` with `[props.value]` deps. |
| B6 | `moo-ds/src/components/CloseBadge.tsx:9` | `e.defaultPrevented = true` assigns to a **read-only** getter — silent no-op, default is never prevented. | `e.preventDefault();` |
| B7 | `moo-ds/src/components/comboBox/ComboBoxInput.tsx:9,16` | `useDebounce(search, 300)` debounces a **value**, not a callback. `debouncedSearch` is just the stable `search` reference, so it runs synchronously every keystroke — no debounce. | Use `useDebouncedCallback`, or debounce the input text and run `search` in an effect. |
| B8 | `moo-ds/src/components/comboBox/ComboBoxInput.tsx:21` | Creatable existence check compares un-lowercased label to a lowercased value (`labelField(i).toString() === value.toLowerCase()`) → existing mixed-case items ("Apple") never match, spurious "create new" appears. | Lowercase both sides. |
| B9 | `moo-ds/src/components/NavItemList.tsx:35` | Route branch passes the 2-arg `onNavItemClick` straight to router `NavLink`, which invokes `onClick(event)` only → `navItem` is `undefined`, `setSelected(undefined)` and `navItem?.onClick` no-op. The non-route branch (line 38) correctly wraps it. | Wrap: `onClick={(e) => onNavItemClick(e, navItem)}`. |
| B10 | `moo-ds/src/components/pagination/SortablePaginationTh.tsx:16` | The `<th>` has `onClick={clickHandler}` (sort) and contains a `MiniPagination` whose buttons don't stop propagation → paging inside a sortable header re-sorts the column. Reachable via `DataGrid` when `canSort && hasHeaderPagination`. | `stopPropagation()` in the pagination button handlers, or scope the sort handler to header content only. |
| B11 | `moo-app/src/services/processAxiosError.ts:10` | `axiosError.response.data.detail ?? …` throws `TypeError` when the error body is `null`/non-JSON (common 500s/gateway errors), masking the original error. | Optional-chain: `axiosError.response.data?.detail ?? axiosError.response.data?.title ?? axiosError.response.statusText`. |
| B12 | `moo-ds/src/hooks/useStorage.ts:10` | `JSON.parse` in the `useState` initializer has no try/catch → a corrupt or legacy-plain-string storage value throws and crashes the tree on mount. | Wrap in try/catch, fall back to `initialValue`. |
| B13 | `moo-ds/src/hooks/useStorage.ts:5-11` | Initializer runs once; a changed `key` keeps the old value, and there's no `storage` event listener → no cross-tab sync. | Re-init on `key` change; add a `storage` listener. |
| B14 | `moo-ds/src/layout/Notifications.tsx:20` | When used with a `defaultTheme` but no active `theme`, the ternary reaches `theme.theme` on an `undefined` `theme` → `TypeError`. | Guard with `theme?.theme`. |
| B15 | `moo-ds/src/utils/dateHelpers.ts:12-19` | `nextSunday` mutates the caller's `Date` (via `setDate/setHours/...`) and never zeros milliseconds, so "midnight" can carry ms. | Clone first (`date = new Date(date)`), add `setMilliseconds(0)`. |
| B16 | `moo-ds/src/providers/ThemeProvider.tsx:12-13` | `document.getElementsByName(...)` and a `console.warn` run in the **render body** — fires twice under StrictMode, unsafe under SSR. | Move DOM read + warning into `useEffect`. |
| B17 | `moo-ds/src/hooks/updatingState.ts:7-9` | `useEffect(() => setState(value), [value])` resets local edits whenever a parent passes a new object/array literal. Also, a function `value` is misinterpreted as a state updater rather than stored. | Compare before resetting, or document primitive/stable-value usage; handle the function overload explicitly. |
| B18 | `moo-ds/src/components/Upload.tsx:51,59,76,85` | `e.currentTarget.files` is nullable; `.length`/`[0]` throw if the dialog is dismissed with no selection. Separately, `isDragging` from `useDragEvents` is computed but never consumed → drag state produces no UI feedback. | Guard `files` before indexing; wire or remove `isDragging`. |
| B19 | `moo-ds/src/hooks/innerRef.ts:7-14` | Callback refs are set but never reset to `null` on unmount → a consumer's ref can hold a stale detached node. | Return cleanup that calls `ref(null)` for the function-ref case. |

---

## 2. Performance

Most of these are **unmemoized context values** — a new object identity each provider render forces every consumer of that context to re-render.

| # | Location | Problem | Fix |
|---|----------|---------|-----|
| P1 | `moo-ds/src/hooks/clickAway.ts:12-19` | `useEffect` has **no dependency array** → re-subscribes `mousedown`/`touchstart` on every render. Used by `ComboBoxContainer`, `TagPanel`, `EditColumn` (frequent re-renderers). | Add deps `[ref, setShow, onClickAway]`; stabilize the handler. |
| P2 | `moo-ds/src/components/comboBox/ComboBoxProvider.tsx:51` | Context `value={{…}}` recreated every render → all `useComboBox()` consumers re-render. | `useMemo` the value. |
| P3 | `moo-ds/src/components/comboBox/ComboBoxProvider.tsx:20,41` | `JSON.stringify(props.items)` in a dep array runs O(n) every render and throws on non-serializable fields. | Use a stable ref or id/length-based key. |
| P4 | `moo-ds/src/providers/LinkProvider.tsx:11` | `value={{Link, NavLink}}` new object each render. | `useMemo` keyed on the two components. |
| P5 | `moo-ds/src/providers/MessageProvider.tsx:23` | Value + both handlers change identity each render. | `useCallback` handlers, `useMemo` value. |
| P6 | `moo-ds/src/providers/ThemeProvider.tsx:30` | `{theme, setTheme, defaultTheme}` recreated each render. | `useMemo`. |
| P7 | `moo-app/src/providers/LayoutProvider.tsx:20-21` | Value object recreated each render → every `useLayout()` consumer (headers, sidebars, Avatar, Page) re-renders on any provider render. | `useMemo` keyed on the state values. |
| P8 | `moo-app/src/layout/Page.tsx:14-18` | Effect writes `breadcrumbs`/`navItems`/`actions` into layout state; callers pass inline array literals → deps change every render → 3 setStates → `LayoutProvider` re-render storm (compounds P7). | Memoize on stable keys / compare content / require stable refs. |

---

## 3. Code smells & low-severity

| Location | Problem |
|----------|---------|
| `moo-ds/src/components/form/FormComboBox.tsx:20` | Leftover `console.log("onChange", items)` ships to consumers, fires on every selection. **Remove.** |
| `moo-ds/src/components/pagination/PaginationControls.tsx:9` | `console.warn` validation runs in production; its allow-list message omits `PageIndicator`, which the code permits. |
| `moo-ds/src/components/SortIcon.tsx:12` | `style={{ visibility: "hidden" }}` — static inline style violates the project's no-inline-styles rule; should be a CSS class. (`Badge.tsx:44`, `Modal.tsx:84` inject dynamic CSS custom properties — defensible exceptions.) |
| `moo-ds/src/components/NavItemList.tsx:41` | `throw "Invalid nav item…"` throws a string literal; use `new Error(...)`. |
| `moo-ds/src/layout/Notifications.tsx:1` | CSS imported via hard-coded `../../../node_modules/react-toastify/dist/ReactToastify.css` — fragile under pnpm/non-default hoisting. Use `"react-toastify/dist/ReactToastify.css"`. |
| `moo-ds/src/layout/SectionForm.tsx:8` | Reassigns the `header` param inside a ternary as a side effect. Use a `const headerNode`. |
| `moo-ds/src/providers/LinkProvider.tsx:4` | `createContext<{…}>(null)` violates its own non-nullable type. Type as `… \| null`. |
| `moo-ds/src/utils/trimEnd.ts:3` | `!charsToRemove \|\| charsToRemove === ""` — second clause is redundant; naming misleads (trims a suffix substring, not a char set). |
| `moo-ds/src/providers/MessageProvider.tsx:37-38` | Empty `MessageProviderProps` interface adds nothing; use `React.PropsWithChildren`. |
| `moo-ds/src/hooks/clickAway.ts:3` / `useStorage.ts` | `ref: React.RefObject<any>` hides the element type; `useStorage` typed `[T,…]` while value can be `undefined`. Tighten. |
| `moo-ds/src/components/Avatar.tsx:5-11` | Component body is a bare `useMemo` (negligible benefit; `React.memo` is idiomatic); `alt="Me"` hardcoded; `clickable` class always applied even without `onClick`. |
| `moo-app/src/MooApp.tsx:24` | `useState<any>(null)` for the MSAL instance; type as `IPublicClientApplication \| null`. |
| `moo-app/src/MooApp.tsx:26-28,43-48` | Effects read `clientId`/`version` with `[]` deps (stale if props change). Version-meta effect writes `content="undefined"` when version is absent and has no cleanup → duplicate `<meta name="version">` on remount. |
| `moo-app/src/services/useApiPut.ts:18,44` | Mutation error typed `null` instead of `DefaultError` (inconsistent with Post/Patch). Same in `useApiPutEmpty`. |
| `moo-app/src/services/useApiGet.ts:12-16` | `total: response.headers["x-total-count"] as T` — a header **string** is cast to the typed total; `PagedResult.total` is a string at runtime. Use `Number(...)`. |
| `moo-app/src/hooks/idParams.ts:5` | `throw Error("bad params")` — uninformative. |
| `moo-app/src/services/{useApiPost,useApiPut,useApiPatch,useApiDelete}.ts` | `onErrorWrapper` + `try/catch → processAxiosError` boilerplate is copy-pasted across 7 hooks. Extract a shared `useApiMutation` helper. |

### Accessibility (design-system baseline)

| Location | Problem |
|----------|---------|
| `moo-ds/src/components/comboBox/ComboBoxInput.tsx:55` | `aria-expanded={items?.length > 0}` should track open state (`show`), not item count; listbox `<ol>/<li>` lack `role="listbox"/"option"` and `aria-controls`. |
| `moo-ds/src/components/comboBox/ComboBoxItem.tsx:16` | Positive `tabIndex={2}` (disrupts tab order); clickable `<li>` lacks `role="option"` and keyboard handler. |
| `moo-ds/src/components/Modal.tsx` | Custom portal modal lacks `role="dialog"`/`aria-modal`, focus trapping, and Escape-to-close. |

---

## 4. Dead code

Very little genuinely dead code exists — the agents correctly attributed unused-but-exported symbols to public API. Concrete items:

- `moo-ds/src/components/Upload.tsx` — `isDragging` from `useDragEvents` is computed but never consumed (see B18).
- `moo-ds/src/components/comboBox/ComboBoxInput.tsx:47-51` — commented-out `useLayoutEffect` focus block; remove or restore.
- `moo-app/src/utils/index.ts` — empty file, re-exported from `index.ts`; harmless.

**Explicitly _not_ dead** (public API, leave alone): `addMsalInterceptor`, `createHttpClient`, `useApiPagedGet`, `useApiPostEmpty`, `useApiPutEmpty`, `PageIndicator` (used by `DataGrid`), `useStorage` (used by the storage hooks), and all `utils`/`models` barrel exports.

---

## Cross-references

Several items overlap with the architectural review (see [`architecture-findings.md`](./architecture-findings.md)): the unmemoized providers (§2) compound the layering concerns; `usePageTitle` (B2), the `useApiDelete` typing (B1), and the duplicated `useErrorHandler`/model files are both quality and architecture issues.
