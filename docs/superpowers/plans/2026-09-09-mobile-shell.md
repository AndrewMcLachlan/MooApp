# Mobile shell (moo-ds + moo-app) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give moo-app a real mobile header — one 56px bar with drawer navigation and an overflow menu — and give moo-ds the primitives it and its consumers need: breakpoint tokens, a menu, a bottom drawer, and a filter bar.

**Architecture:** moo-ds gains four self-contained additions (breakpoints, `Menu`, `Drawer placement="bottom"`, `FilterBar`/`FilterChip`) plus the header CSS. moo-app then replaces its `ReactNode[]` actions with a described `PageAction[]` — a breaking change — so both headers can render the same actions differently: a row of controls on desktop, a menu on mobile. `customActions` remains a `ReactNode[]` escape hatch for controls that are neither a command nor a link.

**Tech Stack:** React 19, TypeScript, Vite library mode, Vitest + Testing Library, npm workspaces monorepo.

**Spec:** `K:/Dev/Apps/MooBank/docs/superpowers/specs/2026-09-09-mobile-shell-design.md` (kept in MooBank, where the problem was found; read it before starting)

## Global Constraints

- **No inline styles.** Anything from a closed set (`size`, `variant`, `placement`) is a class, never an inline custom property. Components may accept and spread a `style` prop but must never rely on one to function.
- **No Bootstrap.** moo-ds ships its own components. Class names derived from Bootstrap's contract (`offcanvas`, `popover`) are an existing convention, not a dependency — never add `react-bootstrap` or `bootstrap`.
- Peer dependencies are externalised; do not add runtime dependencies to `moo-ds` or `moo-app`.
- Existing CSS breakpoint values are authoritative and must not change: `sm 576, md 768, lg 992, xl 1200, xxl 1500, fhd 1880, qhd 2520, uhd 3200`.
- Comments explain why a thing *is*, never what changed or what was rejected. No "was X, now Y" comments.
- Every task ends with a passing `npm run test:run` and a commit.
- Run from the repo root: `npm run test:run`, `npm run type-check`, `npm run lint`.

---

### Task 1: Breakpoint tokens and hook

The four hard-coded widths in consuming apps all exist because moo-ds never exported the numbers its own CSS uses.

**Files:**
- Create: `moo-ds/src/models/breakpoints.ts`
- Create: `moo-ds/src/hooks/breakpoint.ts`
- Create: `moo-ds/src/hooks/__tests__/breakpoint.test.tsx`
- Modify: `moo-ds/src/models/index.ts`
- Modify: `moo-ds/src/hooks/index.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `breakpoints` (record of `Breakpoint` → px number), `type Breakpoint`, `useIsAtLeast(bp: Breakpoint): boolean`

- [ ] **Step 1: Write the failing test**

`moo-ds/src/hooks/__tests__/breakpoint.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsAtLeast } from '../breakpoint';
import { breakpoints } from '../../models/breakpoints';

const listeners = new Set<() => void>();
let matches = false;

const mockMatchMedia = (initial: boolean) => {
  matches = initial;
  listeners.clear();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, cb: () => void) => { listeners.add(cb); },
    removeEventListener: (_: string, cb: () => void) => { listeners.delete(cb); },
  })) as unknown as typeof window.matchMedia;
};

const setMatches = (value: boolean) => {
  matches = value;
  act(() => { listeners.forEach(cb => cb()); });
};

describe('breakpoints', () => {
  it('matches the values the stylesheet uses', () => {
    expect(breakpoints.sm).toBe(576);
    expect(breakpoints.md).toBe(768);
    expect(breakpoints.lg).toBe(992);
    expect(breakpoints.xl).toBe(1200);
  });
});

describe('useIsAtLeast', () => {
  beforeEach(() => { mockMatchMedia(false); });

  it('queries min-width for the named breakpoint', () => {
    renderHook(() => useIsAtLeast('lg'));
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 992px)');
  });

  it('returns false below the breakpoint', () => {
    const { result } = renderHook(() => useIsAtLeast('md'));
    expect(result.current).toBe(false);
  });

  it('returns true at or above the breakpoint', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useIsAtLeast('md'));
    expect(result.current).toBe(true);
  });

  it('updates when the viewport crosses the breakpoint', () => {
    const { result } = renderHook(() => useIsAtLeast('md'));
    expect(result.current).toBe(false);
    setMatches(true);
    expect(result.current).toBe(true);
  });

  it('removes its listener on unmount', () => {
    const { unmount } = renderHook(() => useIsAtLeast('md'));
    expect(listeners.size).toBe(1);
    unmount();
    expect(listeners.size).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- breakpoint`
Expected: FAIL — cannot resolve `../breakpoint` or `../../models/breakpoints`.

- [ ] **Step 3: Write the implementation**

`moo-ds/src/models/breakpoints.ts`:

```ts
/**
 * The widths the stylesheet's `@media` blocks and `d-{tier}-*` utilities use.
 * Exported so a consuming app never restates one: a number written twice is a
 * number that drifts, and a layout that switches at one width while its content
 * switches at another looks like neither.
 */
export const breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1500,
    fhd: 1880,
    qhd: 2520,
    uhd: 3200,
} as const;

export type Breakpoint = keyof typeof breakpoints;
```

`moo-ds/src/hooks/breakpoint.ts`:

```ts
import { useCallback, useSyncExternalStore } from "react";
import { breakpoints, type Breakpoint } from "../models/breakpoints";

const mediaQuery = (breakpoint: Breakpoint) => `(min-width: ${breakpoints[breakpoint]}px)`;

/**
 * Whether the viewport is at least as wide as a named breakpoint, tracking
 * changes.
 *
 * The server snapshot is `false`, so a render with no `window` behaves as the
 * narrowest case rather than throwing.
 */
export const useIsAtLeast = (breakpoint: Breakpoint): boolean => {

    const subscribe = useCallback((onChange: () => void) => {
        const list = window.matchMedia(mediaQuery(breakpoint));
        list.addEventListener("change", onChange);
        return () => list.removeEventListener("change", onChange);
    }, [breakpoint]);

    const getSnapshot = useCallback(() => window.matchMedia(mediaQuery(breakpoint)).matches, [breakpoint]);

    return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
```

Append to `moo-ds/src/models/index.ts`:

```ts
export * from "./breakpoints";
```

Append to `moo-ds/src/hooks/index.ts`:

```ts
export * from "./breakpoint";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- breakpoint`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add moo-ds/src/models/breakpoints.ts moo-ds/src/models/index.ts moo-ds/src/hooks/breakpoint.ts moo-ds/src/hooks/index.ts moo-ds/src/hooks/__tests__/breakpoint.test.tsx
git commit -m "feat(moo-ds): export breakpoint tokens and useIsAtLeast

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 2: Drawer bottom placement

A filter sheet rises from the bottom. `Drawer` is already a portal-rendered top-layer overlay, so this is a variant rather than a new component.

**Files:**
- Modify: `moo-ds/src/components/Drawer.tsx` (the `placement` union, ~line 10)
- Modify: `moo-ds/src/css/components/_offcanvas.css` (after `.offcanvas-end`, ~line 68)
- Modify: `moo-ds/src/components/__tests__/Drawer.test.tsx` (the `placement` describe block)

**Interfaces:**
- Consumes: nothing
- Produces: `<Drawer placement="bottom">` rendering `.offcanvas-bottom`

- [ ] **Step 1: Write the failing test**

Add inside the existing `describe('placement', ...)` block in `moo-ds/src/components/__tests__/Drawer.test.tsx`:

```tsx
    it('applies bottom placement', () => {
      const { container } = render(<Drawer show onHide={vi.fn()} placement="bottom"><Drawer.Body>Content</Drawer.Body></Drawer>);
      expect(container.querySelector('.offcanvas-bottom')).toBeInTheDocument();
    });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- Drawer`
Expected: FAIL — TypeScript rejects `placement="bottom"`, and `.offcanvas-bottom` is not found.

- [ ] **Step 3: Write the implementation**

In `moo-ds/src/components/Drawer.tsx`, widen the union:

```ts
    placement?: "start" | "end" | "bottom";
```

In `moo-ds/src/css/components/_offcanvas.css`, add `--offcanvas-max-height` to the `.offcanvas` token block (beside `--offcanvas-width`):

```css
    --offcanvas-max-height: 85dvh;
    --offcanvas-radius: 0.875rem;
```

Then after `.offcanvas-end`:

```css
.offcanvas-bottom {
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    max-height: var(--offcanvas-max-height);
    border-top: var(--offcanvas-border-width) solid var(--offcanvas-border-colour);
    border-radius: var(--offcanvas-radius) var(--offcanvas-radius) 0 0;
    /* A sheet sits against the bottom edge, where the home indicator is. */
    padding-bottom: env(safe-area-inset-bottom, 0px);
    transform: translateY(100%);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- Drawer`
Expected: PASS, all Drawer tests including the new one.

- [ ] **Step 5: Commit**

```bash
git add moo-ds/src/components/Drawer.tsx moo-ds/src/css/components/_offcanvas.css moo-ds/src/components/__tests__/Drawer.test.tsx
git commit -m "feat(moo-ds): add bottom placement to Drawer

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 3: Menu component

`UserMenu` builds a menu out of `OverlayTrigger` and `Popover` by hand. The overflow menu needs the same thing, so the arrangement becomes a component before it is written a second time.

**Files:**
- Create: `moo-ds/src/components/Menu.tsx`
- Create: `moo-ds/src/components/__tests__/Menu.test.tsx`
- Create: `moo-ds/src/css/components/_menu.css`
- Modify: `moo-ds/src/components/index.ts`
- Modify: `moo-ds/src/css/_components.css`

**Interfaces:**
- Consumes: `OverlayTrigger`, `Popover` from `moo-ds/src/components`
- Produces: `Menu` with `Menu.Item` and `Menu.Divider`.
  `MenuProps = { id: string; trigger: React.ReactNode; placement?: string; className?: string }`.
  `MenuItemProps = { icon?: React.ReactNode; checked?: boolean; disabled?: boolean; onClick?: () => void; to?: string }`.
  An item with `to` renders an anchor via `useLink()`, so navigation items keep middle-click and
  open-in-new-tab.

- [ ] **Step 1: Write the failing test**

`moo-ds/src/components/__tests__/Menu.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Menu } from '../Menu';
import { LinkProvider } from '../../providers';

const open = () => fireEvent.click(screen.getByRole('button', { name: 'Open' }));

// Only a Menu containing links needs this; the other tests prove a Menu works
// with no provider in the tree.
const withLinks = (ui: React.ReactNode) => (
  <LinkProvider
    LinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
    NavLinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
  >
    {ui}
  </LinkProvider>
);

describe('Menu', () => {
  it('does not render its items until the trigger is clicked', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    expect(screen.queryByText('Import')).not.toBeInTheDocument();
  });

  it('renders its items once opened', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByText('Import')).toBeInTheDocument();
  });

  it('calls onClick when an item is chosen', () => {
    const onClick = vi.fn();
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={onClick}>Import</Menu.Item>
      </Menu>
    );
    open();
    fireEvent.click(screen.getByText('Import'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks an item with checked as a checkbox item', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item checked onClick={vi.fn()}>Show net amount</Menu.Item>
      </Menu>
    );
    open();
    const item = screen.getByRole('menuitemcheckbox');
    expect(item).toHaveAttribute('aria-checked', 'true');
  });

  it('leaves an item without checked as a plain menuitem', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('does not call onClick for a disabled item', () => {
    const onClick = vi.fn();
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item disabled onClick={onClick}>Import</Menu.Item>
      </Menu>
    );
    open();
    fireEvent.click(screen.getByText('Import'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an item with a destination as a link', () => {
    render(withLinks(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item to="/settings/families/add">Add family</Menu.Item>
      </Menu>
    ));
    open();
    expect(screen.getByRole('menuitem', { name: 'Add family' }).querySelector('a')).toHaveAttribute('href', '/settings/families/add');
  });

  it('renders a divider as a separator', () => {
    render(
      <Menu id="test-menu" trigger={<button type="button">Open</button>}>
        <Menu.Item onClick={vi.fn()}>Show net amount</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={vi.fn()}>Import</Menu.Item>
      </Menu>
    );
    open();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- Menu`
Expected: FAIL — cannot resolve `../Menu`.

- [ ] **Step 3: Write the implementation**

`moo-ds/src/components/Menu.tsx`:

```tsx
import classNames from "classnames";
import React, { type PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger } from "./OverlayTrigger";
import { Popover } from "./Popover";
import { useLink } from "../providers";

/* useLink throws outside a LinkProvider, so it is called from a component that
   renders only when there is a destination. A Menu with no links works with no
   provider in the tree. */
const MenuLink: React.FC<PropsWithChildren<{ to: string }>> = ({ to, children }) => {
    const Link = useLink();
    return <Link to={to}>{children}</Link>;
};

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    trigger: React.ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
}

export interface MenuItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onClick"> {
    icon?: React.ReactNode;
    /** Present makes the item a toggle: it reports a checked state and shows a tick. */
    checked?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    /** Renders the item's content as a link, so it keeps middle-click and
        open-in-new-tab. Routing comes from LinkProvider, so the menu stays
        router-agnostic. */
    to?: string;
}

const MenuItem: React.FC<PropsWithChildren<MenuItemProps>> = ({ icon, checked, disabled, onClick, to, className, children, ...rest }) => {

    const content = (
        <>
            <span className="menu-item-icon">{icon}</span>
            <span className="menu-item-label">{children}</span>
            {checked && <FontAwesomeIcon icon="check" className="menu-item-check" />}
        </>
    );

    return (
        <li
            role={checked === undefined ? "menuitem" : "menuitemcheckbox"}
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            className={classNames("menu-item", disabled ? "disabled" : "clickable", className)}
            onClick={disabled ? undefined : onClick}
            {...rest}
        >
            {to && !disabled ? <MenuLink to={to}>{content}</MenuLink> : content}
        </li>
    );
};

MenuItem.displayName = "Menu.Item";

const MenuDivider: React.FC = () => <li className="divider" role="separator" />;

MenuDivider.displayName = "Menu.Divider";

const MenuComponent: React.FC<PropsWithChildren<MenuProps>> = ({ id, trigger, placement = "bottom", className, children, ...rest }) => (
    <OverlayTrigger
        trigger="click"
        placement={placement}
        rootClose
        containerPadding={10}
        overlay={(close: () => void) => (
            <Popover id={id} className={classNames("menu-popover", className)} {...rest}>
                <Popover.Body>
                    <ul role="menu" onClick={close}>{children}</ul>
                </Popover.Body>
            </Popover>
        )}
    >
        {trigger}
    </OverlayTrigger>
);

MenuComponent.displayName = "Menu";

export const Menu = Object.assign(MenuComponent, {
    Item: MenuItem,
    Divider: MenuDivider,
});
```

`moo-ds/src/css/components/_menu.css`:

```css
.menu-popover {
    --menu-item-padding-x: 0.75rem;
    --menu-item-padding-y: 0.5rem;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        min-width: 11rem;
    }

    .menu-item > a {
        display: contents;
        color: inherit;
        text-decoration: none;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: var(--menu-item-padding-y) var(--menu-item-padding-x);
        border-radius: 4px;
        color: var(--body-colour);
        white-space: nowrap;
    }

    .menu-item.clickable:hover {
        background-color: var(--hover);
    }

    .menu-item.disabled {
        color: var(--body-colour-dim);
    }

    /* Reserved whether or not this item has an icon, so labels line up down the
       menu and a mixed list does not read as ragged. */
    .menu-item-icon {
        display: inline-flex;
        justify-content: center;
        width: 1rem;
        flex: 0 0 1rem;
        color: var(--secondary-colour);
    }

    .menu-item-label {
        flex: 1;
    }

    .menu-item-check {
        color: var(--primary);
    }

    .divider {
        height: 1px;
        margin: 0.25rem 0;
        background-color: var(--border-colour);
    }
}
```

Append to `moo-ds/src/components/index.ts`:

```ts
export * from "./Menu";
```

Add the import to `moo-ds/src/css/_components.css`, keeping the file's existing ordering convention:

```css
@import "./components/_menu.css";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- Menu`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add moo-ds/src/components/Menu.tsx moo-ds/src/components/index.ts moo-ds/src/components/__tests__/Menu.test.tsx moo-ds/src/css/components/_menu.css moo-ds/src/css/_components.css
git commit -m "feat(moo-ds): add Menu

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 4: FilterBar and FilterChip

A filter whose state is invisible is one you forget you set, and then the figures look wrong and the app looks broken. The bar keeps the state on screen; the sheet holds the fields.

**Files:**
- Create: `moo-ds/src/components/FilterBar.tsx`
- Create: `moo-ds/src/components/FilterChip.tsx`
- Create: `moo-ds/src/components/__tests__/FilterBar.test.tsx`
- Create: `moo-ds/src/css/components/_filterbar.css`
- Modify: `moo-ds/src/components/index.ts`
- Modify: `moo-ds/src/css/_components.css`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  `FilterBarProps = { primary?: React.ReactNode; activeCount?: number; onOpenFilters: () => void; filtersLabel?: string; onClear?: () => void }`
  `FilterChipProps = { onRemove: () => void; removeLabel?: string }`

- [ ] **Step 1: Write the failing test**

`moo-ds/src/components/__tests__/FilterBar.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../FilterBar';
import { FilterChip } from '../FilterChip';

describe('FilterBar', () => {
  it('renders the primary slot', () => {
    render(<FilterBar primary={<span>Jan – Jun 2026</span>} onOpenFilters={vi.fn()} />);
    expect(screen.getByText('Jan – Jun 2026')).toBeInTheDocument();
  });

  it('calls onOpenFilters when the button is clicked', () => {
    const onOpenFilters = vi.fn();
    render(<FilterBar onOpenFilters={onOpenFilters} />);
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    expect(onOpenFilters).toHaveBeenCalledTimes(1);
  });

  it('shows the active count when there is one', () => {
    render(<FilterBar activeCount={2} onOpenFilters={vi.fn()} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows no count when nothing is active', () => {
    const { container } = render(<FilterBar activeCount={0} onOpenFilters={vi.fn()} />);
    expect(container.querySelector('.filter-bar-count')).not.toBeInTheDocument();
  });

  it('omits the chip row when there are no chips', () => {
    const { container } = render(<FilterBar onOpenFilters={vi.fn()} />);
    expect(container.querySelector('.filter-bar-chips')).not.toBeInTheDocument();
  });

  it('renders chips and a clear control when given both', () => {
    const onClear = vi.fn();
    render(
      <FilterBar onOpenFilters={vi.fn()} onClear={onClear}>
        <FilterChip onRemove={vi.fn()}>Groceries</FilterChip>
      </FilterBar>
    );
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

describe('FilterChip', () => {
  it('calls onRemove when dismissed', () => {
    const onRemove = vi.fn();
    render(<FilterChip onRemove={onRemove}>Groceries</FilterChip>);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Groceries' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('accepts an explicit remove label', () => {
    render(<FilterChip onRemove={vi.fn()} removeLabel="Remove tag filter"><em>Groceries</em></FilterChip>);
    expect(screen.getByRole('button', { name: 'Remove tag filter' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- FilterBar`
Expected: FAIL — cannot resolve `../FilterBar`.

- [ ] **Step 3: Write the implementation**

`moo-ds/src/components/FilterChip.tsx`:

```tsx
import classNames from "classnames";
import React, { type PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FilterChipProps extends React.HTMLAttributes<HTMLSpanElement> {
    onRemove: () => void;
    /** Overrides the accessible name of the dismiss control, for a chip whose
        children are not plain text. */
    removeLabel?: string;
}

export const FilterChip: React.FC<PropsWithChildren<FilterChipProps>> = ({ onRemove, removeLabel, className, children, ...rest }) => (
    <span className={classNames("filter-chip", className)} {...rest}>
        <span className="filter-chip-label">{children}</span>
        <button
            type="button"
            className="filter-chip-remove"
            aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : "filter"}`}
            onClick={onRemove}
        >
            <FontAwesomeIcon icon="times" />
        </button>
    </span>
);

FilterChip.displayName = "FilterChip";
```

`moo-ds/src/components/FilterBar.tsx`:

```tsx
import classNames from "classnames";
import React, { type PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The one filter worth keeping on the bar rather than behind the button. */
    primary?: React.ReactNode;
    activeCount?: number;
    onOpenFilters: () => void;
    filtersLabel?: string;
    onClear?: () => void;
}

export const FilterBar: React.FC<PropsWithChildren<FilterBarProps>> = ({ primary, activeCount = 0, onOpenFilters, filtersLabel = "Filters", onClear, className, children, ...rest }) => {

    const hasChips = React.Children.count(children) > 0;

    return (
        <div className={classNames("filter-bar", className)} {...rest}>
            <div className="filter-bar-row">
                {primary && <div className="filter-bar-primary">{primary}</div>}
                <button
                    type="button"
                    className={classNames("filter-bar-button", activeCount > 0 && "active")}
                    onClick={onOpenFilters}
                >
                    <FontAwesomeIcon icon="filter" />
                    <span>{filtersLabel}</span>
                    {activeCount > 0 && <span className="filter-bar-count">{activeCount}</span>}
                </button>
            </div>
            {hasChips && (
                <div className="filter-bar-chips">
                    {children}
                    {onClear && <button type="button" className="filter-bar-clear" onClick={onClear}>Clear</button>}
                </div>
            )}
        </div>
    );
};

FilterBar.displayName = "FilterBar";
```

`moo-ds/src/css/components/_filterbar.css`:

```css
.filter-bar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-bar-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-bar-primary {
    flex: 1;
    min-width: 0;
}

.filter-bar-button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    height: 2.25rem;
    padding: 0 0.85rem;
    border: 1px solid var(--border-colour);
    border-radius: 1.125rem;
    background-color: var(--section-bg);
    color: var(--body-colour);
    white-space: nowrap;
    cursor: pointer;
}

.filter-bar-button.active {
    border-color: var(--primary);
}

.filter-bar-count {
    background-color: var(--primary);
    color: #fff;
    border-radius: 0.6rem;
    padding: 0 0.35rem;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1.1rem;
}

.filter-bar-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
}

.filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    height: 1.6rem;
    padding: 0 0.35rem 0 0.6rem;
    border: 1px solid var(--border-colour);
    border-radius: 0.8rem;
    background-color: var(--section-bg);
    font-size: 0.8rem;
}

.filter-chip-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.1rem;
    height: 1.1rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-colour);
    cursor: pointer;
}

.filter-chip-remove:hover {
    color: var(--body-colour);
}

.filter-bar-clear {
    margin-left: auto;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--link-colour);
    font-size: 0.8rem;
    cursor: pointer;
}

.filter-bar-clear:hover {
    text-decoration: underline;
}
```

Append to `moo-ds/src/components/index.ts`:

```ts
export * from "./FilterBar";
export * from "./FilterChip";
```

Add to `moo-ds/src/css/_components.css`:

```css
@import "./components/_filterbar.css";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- FilterBar`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add moo-ds/src/components/FilterBar.tsx moo-ds/src/components/FilterChip.tsx moo-ds/src/components/index.ts moo-ds/src/components/__tests__/FilterBar.test.tsx moo-ds/src/css/components/_filterbar.css moo-ds/src/css/_components.css
git commit -m "feat(moo-ds): add FilterBar and FilterChip

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 5: Header CSS for a single mobile bar

The header currently overflows because the grid track is shorter than its contents and the first band has a 240px minimum for a search box mobile leaves empty.

**Files:**
- Modify: `moo-ds/src/css/layout/_layout.css` (the `grid-template-rows` declarations, ~lines 8 and 62)
- Modify: `moo-ds/src/css/layout/_header.css` (add the `.mobile-header` block after the existing `.first-header, .second-header` rules)

**Interfaces:**
- Consumes: nothing
- Produces: `.mobile-header` with `.page-title`, sized 56px; a header grid row that takes its height from content

- [ ] **Step 1: Fix the grid track**

In `moo-ds/src/css/layout/_layout.css`, in the top-level `.app-container` rule change:

```css
  grid-template-rows: min-content 80px 1fr;
```

to:

```css
  grid-template-rows: min-content min-content 1fr;
```

and in the `@media screen and (max-width: 992px)` block change the surviving pair:

```css
      grid-template-columns: 1fr;
      grid-template-rows: min-content 1fr;
```

A fixed track is what let the header be shorter than its own contents; content sizing makes that state unreachable.

- [ ] **Step 2: Stop the desktop bands inheriting a whole header's height**

In `moo-ds/src/css/layout/_header.css`, remove `height: var(--header-height);` from the `.app-container > header` rule, leaving the bands to size themselves. The bands keep their own `height: var(--header-height)`.

- [ ] **Step 3: Add the mobile bar**

Append inside the `.app-container > header` block in `moo-ds/src/css/layout/_header.css`, after the `.first-header, .second-header` rules:

```css
    .mobile-header {
        --mobile-header-height: 56px;

        height: var(--mobile-header-height);
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding-inline: 0.75rem;
        background-color: var(--header-bg);
        border-bottom: 1px solid var(--border-colour);

        /* Must not wrap: a title that grows a line makes the bar taller than
           the content below it expects, which is what produced the overlap. */
        .page-title {
            flex: 1;
            min-width: 0;
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--header-text);
        }

        .action-menu-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.25rem;
            height: 2.25rem;
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--secondary-colour);
            cursor: pointer;
        }
    }
```

- [ ] **Step 4: Verify nothing regressed**

Run: `npm run test:run` and `npm run type-check`
Expected: PASS. Then `npm run storybook -w @andrewmclachlan/storybook` and check the layout stories at 1280px and 390px: no overlap at either.

- [ ] **Step 5: Commit**

```bash
git add moo-ds/src/css/layout/_layout.css moo-ds/src/css/layout/_header.css
git commit -m "fix(moo-ds): size the header grid row from its content

The header track was a fixed 80px while each band asked for
var(--header-height), also 80px on moo-default, so a two-band header
overflowed its own row and the breadcrumb ran across the logo.

Adds .mobile-header for the single-bar mobile treatment.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 6: PageAction replaces ReactNode actions

A header cannot re-render an opaque node as a menu item. This is the breaking change; everything after it depends on the type.

**Files:**
- Create: `moo-app/src/models/PageAction.ts`
- Modify: `moo-app/src/models/index.ts`
- Modify: `moo-app/src/providers/LayoutProvider.tsx`
- Modify: `moo-app/src/layout/Page.tsx`
- Create: `moo-app/src/layout/__tests__/PageActionControl.test.tsx`
- Create: `moo-app/src/layout/PageActionControl.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces:
  ```ts
  type PageAction = PageCommand | PageLink;   // see the model file in Step 3
  ```
  `PageProps.actions?: PageAction[]`, `PageProps.customActions?: React.ReactNode[]`,
  `useLayout().actions: PageAction[]`, `useLayout().customActions: React.ReactNode[]`,
  `<PageActionControl action={action} />` for the desktop row.

- [ ] **Step 1: Write the failing test**

`moo-app/src/layout/__tests__/PageActionControl.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkProvider } from '@andrewmclachlan/moo-ds';
import { PageActionControl } from '../PageActionControl';

// IconLinkButton calls useLink, which throws with no provider above it.
const withLinks = (ui: React.ReactNode) => (
  <LinkProvider
    LinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
    NavLinkComponent={({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>}
  >
    {ui}
  </LinkProvider>
);

describe('PageActionControl', () => {
  it('renders a command as a button and calls onClick', () => {
    const onClick = vi.fn();
    render(<PageActionControl action={{ id: 'import', label: 'Import', onClick }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an action with checked as a switch', () => {
    render(<PageActionControl action={{ id: 'show-net', label: 'Show net amount', checked: true, onClick: vi.fn() }} />);
    const control = screen.getByRole('checkbox', { name: 'Show net amount' });
    expect(control).toBeChecked();
  });

  it('toggles through onClick', () => {
    const onClick = vi.fn();
    render(<PageActionControl action={{ id: 'show-net', label: 'Show net amount', checked: false, onClick }} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Show net amount' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a destination as a link', () => {
    render(withLinks(<PageActionControl action={{ id: 'add-family', label: 'Add family', to: '/settings/families/add' }} />));
    expect(screen.getByRole('link', { name: 'Add family' })).toHaveAttribute('href', '/settings/families/add');
  });

  it('disables a disabled action', () => {
    render(<PageActionControl action={{ id: 'import', label: 'Import', disabled: true, onClick: vi.fn() }} />);
    expect(screen.getByRole('button', { name: 'Import' })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- PageActionControl`
Expected: FAIL — cannot resolve `../PageActionControl`.

- [ ] **Step 3: Write the implementation**

`moo-app/src/models/PageAction.ts`:

```ts
interface PageActionBase {
    /** The React key, and the id the desktop switch pairs with its label. */
    id: string;
    label: string;
    icon?: React.ReactNode;
    /** "write" sorts below the menu's separator, away from the reading toggles. */
    group?: "read" | "write";
    disabled?: boolean;
    variant?: "primary" | "secondary";
}

interface PageCommand extends PageActionBase {
    onClick: () => void;
    /** Present makes this a toggle: a switch on desktop, a ticked item in a menu. */
    checked?: boolean;
    to?: never;
}

/**
 * Navigation stays an anchor. Collapsing it to a handler costs middle-click,
 * open-in-new-tab and copy-link, and a third of the call sites are links.
 */
interface PageLink extends PageActionBase {
    to: string;
    onClick?: never;
    checked?: never;
}

/**
 * A page action described rather than rendered, so each header can present it
 * in the form that fits: a control in a row on desktop, an item in a menu on a
 * phone. A node can only be placed, not re-presented, which is why `actions`
 * takes these and `customActions` takes the nodes.
 */
export type PageAction = PageCommand | PageLink;
```

Append to `moo-app/src/models/index.ts`:

```ts
export * from "./PageAction";
```

`moo-app/src/layout/PageActionControl.tsx`:

```tsx
import { IconButton, IconLinkButton, Input } from "@andrewmclachlan/moo-ds";
import { type PageAction } from "../models/PageAction";

export const PageActionControl: React.FC<PageActionControlProps> = ({ action }) => {

    if (action.to !== undefined) {
        return (
            <IconLinkButton
                badge
                variant={action.variant ?? "primary"}
                to={action.to}
            >
                {action.icon}
                {action.label}
            </IconLinkButton>
        );
    }

    if (action.checked !== undefined) {
        return (
            <Input.Switch
                id={action.id}
                label={action.label}
                checked={action.checked}
                disabled={action.disabled}
                onChange={action.onClick}
            />
        );
    }

    return (
        <IconButton
            badge
            variant={action.variant ?? "primary"}
            disabled={action.disabled}
            onClick={action.onClick}
        >
            {action.icon}
            {action.label}
        </IconButton>
    );
};

PageActionControl.displayName = "PageActionControl";

export interface PageActionControlProps {
    action: PageAction;
}
```

In `moo-app/src/providers/LayoutProvider.tsx`, change the actions state and add custom actions:

```tsx
    const [actions, setActions] = useState<PageAction[]>([]);
    const [customActions, setCustomActions] = useState<ReactNode[]>([]);
```

Add `customActions` and `setCustomActions` to the context value and to its dependency array, alongside `actions`.

In `moo-app/src/layout/Page.tsx`, change the props and thread the new value through the same `applyByReference` mechanism the existing ones use:

```tsx
export interface PageProps {
    actions?: PageAction[];
    customActions?: ReactNode[];
}
```

```tsx
    const lastCustomActions = useRef<ReactNode[] | undefined>(undefined);
    ...
        const resolvedCustomActions = customActions ?? EMPTY;
        applyByReference(lastCustomActions, resolvedCustomActions, layout.setCustomActions);
```

with `customActions` added to the effect's dependency array.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- PageActionControl`
Expected: PASS, 5 tests.

Then `npm run type-check`. The `demoo` workspace will fail where it passes nodes to `actions`; that is Task 9.

- [ ] **Step 5: Commit**

```bash
git add moo-app/src/models/PageAction.ts moo-app/src/models/index.ts moo-app/src/layout/PageActionControl.tsx moo-app/src/layout/__tests__/PageActionControl.test.tsx moo-app/src/providers/LayoutProvider.tsx moo-app/src/layout/Page.tsx
git commit -m "feat(moo-app)!: describe page actions instead of taking nodes

BREAKING CHANGE: Page's actions prop takes PageAction[] rather than
ReactNode[]. A node can be placed but not re-presented, so a mobile
header could not render one as a menu item. customActions keeps taking
nodes for controls that are not a label and a handler.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 7: ActionMenu

**Files:**
- Create: `moo-app/src/layout/ActionMenu.tsx`
- Create: `moo-app/src/layout/__tests__/ActionMenu.test.tsx`

**Interfaces:**
- Consumes: `Menu` from Task 3, `PageAction` from Task 6
- Produces: `<ActionMenu actions={PageAction[]} />`, rendering nothing when `actions` is empty

- [ ] **Step 1: Write the failing test**

`moo-app/src/layout/__tests__/ActionMenu.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionMenu } from '../ActionMenu';

const open = () => fireEvent.click(screen.getByRole('button', { name: 'More actions' }));

describe('ActionMenu', () => {
  it('renders nothing when there are no actions', () => {
    const { container } = render(<ActionMenu actions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders an item per action', () => {
    render(<ActionMenu actions={[
      { id: 'import', label: 'Import', onClick: vi.fn() },
      { id: 'add', label: 'Add transaction', onClick: vi.fn() },
    ]} />);
    open();
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Add transaction')).toBeInTheDocument();
  });

  it('calls the action when its item is chosen', () => {
    const onClick = vi.fn();
    render(<ActionMenu actions={[{ id: 'import', label: 'Import', onClick }]} />);
    open();
    fireEvent.click(screen.getByText('Import'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows a toggle action as checked', () => {
    render(<ActionMenu actions={[{ id: 'net', label: 'Show net amount', checked: true, onClick: vi.fn() }]} />);
    open();
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('puts write actions below a separator, whatever order they arrive in', () => {
    const { baseElement } = render(<ActionMenu actions={[
      { id: 'import', label: 'Import', group: 'write', onClick: vi.fn() },
      { id: 'net', label: 'Show net amount', checked: false, onClick: vi.fn() },
    ]} />);
    open();
    const items = [...baseElement.querySelectorAll('.menu-item, .divider')]
      .map(el => el.classList.contains('divider') ? '---' : el.textContent);
    expect(items).toEqual(['Show net amount', '---', 'Import']);
  });

  it('omits the separator when every action is in one group', () => {
    const { baseElement } = render(<ActionMenu actions={[
      { id: 'net', label: 'Show net amount', checked: false, onClick: vi.fn() },
    ]} />);
    open();
    expect(baseElement.querySelector('.divider')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- ActionMenu`
Expected: FAIL — cannot resolve `../ActionMenu`.

- [ ] **Step 3: Write the implementation**

`moo-app/src/layout/ActionMenu.tsx`:

```tsx
import { Menu } from "@andrewmclachlan/moo-ds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type PageAction } from "../models/PageAction";

export const ActionMenu: React.FC<ActionMenuProps> = ({ actions }) => {

    if (actions.length === 0) return null;

    const read = actions.filter(a => (a.group ?? "read") === "read");
    const write = actions.filter(a => a.group === "write");

    const item = (action: PageAction) => (
        <Menu.Item
            key={action.id}
            icon={action.icon}
            checked={action.checked}
            disabled={action.disabled}
            onClick={action.onClick}
            to={action.to}
        >
            {action.label}
        </Menu.Item>
    );

    return (
        <Menu
            id="page-actions"
            placement="bottom"
            trigger={(
                <button type="button" className="action-menu-toggle" aria-label="More actions">
                    <FontAwesomeIcon icon="ellipsis-vertical" />
                </button>
            )}
        >
            {read.map(item)}
            {read.length > 0 && write.length > 0 && <Menu.Divider />}
            {write.map(item)}
        </Menu>
    );
};

ActionMenu.displayName = "ActionMenu";

export interface ActionMenuProps {
    actions: PageAction[];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- ActionMenu`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add moo-app/src/layout/ActionMenu.tsx moo-app/src/layout/__tests__/ActionMenu.test.tsx
git commit -m "feat(moo-app): add ActionMenu for page actions

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 8: The mobile header, and the desktop header on PageAction

**Files:**
- Modify: `moo-app/src/layout/Mobile/Header.tsx` (replace entirely)
- Modify: `moo-app/src/layout/Desktop/Header.tsx` (the `.actions` div, ~line 60)
- Create: `moo-app/src/layout/__tests__/MobileHeader.test.tsx`

**Interfaces:**
- Consumes: `ActionMenu` (Task 7), `PageActionControl` (Task 6), `.mobile-header` CSS (Task 5)
- Produces: the finished mobile header

- [ ] **Step 1: Write the failing test**

`moo-app/src/layout/__tests__/MobileHeader.test.tsx` — the mock shape follows the existing
`Header.test.tsx` in the same folder:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Mobile/Header';

const mockSetShowSidebar = vi.fn();
const mockUseLayout = vi.fn();

vi.mock('../../providers', () => ({
  useLayout: () => mockUseLayout(),
  useApp: () => ({ name: 'Test App' }),
}));

vi.mock('@andrewmclachlan/moo-ds', () => ({
  MenuToggle: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="menu-toggle" onClick={onClick}>Toggle</button>
  ),
}));

vi.mock('../ActionMenu', () => ({
  ActionMenu: ({ actions }: { actions: unknown[] }) =>
    actions.length > 0 ? <button type="button" aria-label="More actions">More</button> : null,
}));

const layout = (overrides: Record<string, unknown> = {}) => {
  mockUseLayout.mockReturnValue({
    breadcrumbs: [],
    actions: [],
    customActions: [],
    setShowSidebar: mockSetShowSidebar,
    ...overrides,
  });
};

describe('Mobile Header', () => {
  beforeEach(() => {
    mockUseLayout.mockReset();
    mockSetShowSidebar.mockClear();
  });

  it('renders only the last breadcrumb as the title', () => {
    layout({ breadcrumbs: [
      { text: 'Home', route: '/' },
      { text: 'Accounts', route: '/accounts' },
      { text: 'Joint Savings', route: '/accounts/1' },
    ] });
    render(<Header menu={[]} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Joint Savings');
    expect(screen.queryByText('Accounts')).not.toBeInTheDocument();
  });

  it('opens the drawer from the toggle', () => {
    layout();
    render(<Header menu={[]} />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(mockSetShowSidebar).toHaveBeenCalledWith(true);
  });

  it('gives described actions to the menu rather than the bar', () => {
    layout({ actions: [{ id: 'import', label: 'Import', onClick: vi.fn() }] });
    render(<Header menu={[]} />);
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
    expect(screen.queryByText('Import')).not.toBeInTheDocument();
  });

  it('renders custom actions in the bar', () => {
    layout({ customActions: [<button key="s" type="button">Search</button>] });
    render(<Header menu={[]} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders no menu when there are no actions', () => {
    layout({ actions: [] });
    render(<Header menu={[]} />);
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- MobileHeader`
Expected: FAIL — the header still renders two bands and a full breadcrumb.

- [ ] **Step 3: Write the implementation**

Replace `moo-app/src/layout/Mobile/Header.tsx`:

```tsx
import { MenuToggle } from "@andrewmclachlan/moo-ds";
import { type HeaderComponent } from "../Types";
import { useLayout } from "../../providers";
import { ActionMenu } from "../ActionMenu";

export const Header: HeaderComponent = () => {
    const { breadcrumbs, actions, customActions, setShowSidebar } = useLayout();

    const current = breadcrumbs[breadcrumbs.length - 1];

    return (
        <header className="d-lg-none">
            <div className="mobile-header">
                <MenuToggle onClick={() => setShowSidebar(true)} />
                <h1 className="page-title">{current?.text}</h1>
                {customActions}
                <ActionMenu actions={actions} />
            </div>
        </header>
    );
};
```

In `moo-app/src/layout/Desktop/Header.tsx`, render the described actions:

```tsx
                <div className="actions">
                    {actions.map(action => <PageActionControl key={action.id} action={action} />)}
                    {customActions}
                </div>
```

with `customActions` pulled from `useLayout()` and `PageActionControl` imported from `../PageActionControl`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run` (the whole suite — the existing `Header.test.tsx` also touches this code)
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add moo-app/src/layout/Mobile/Header.tsx moo-app/src/layout/Desktop/Header.tsx moo-app/src/layout/__tests__/MobileHeader.test.tsx
git commit -m "feat(moo-app): single-bar mobile header with an overflow menu

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 9: The user menu moves into the drawer

The mobile bar drops the first band, and with it the settings menu and the avatar. Those are not
lost — the drawer is where they belong on a phone — but nothing puts them there yet, so this task
exists to stop the mobile header shipping with sign-out unreachable.

**Files:**
- Modify: `moo-app/src/layout/Mobile/Sidebar.tsx`
- Modify: `moo-app/src/layout/Types.ts` (`SidebarProps`)
- Modify: `moo-app/src/layout/Layout.tsx` (pass the header's menu props through to the mobile sidebar)
- Modify: `moo-app/src/MooAppLayout.tsx`
- Create: `moo-app/src/layout/__tests__/MobileSidebar.test.tsx`

**Interfaces:**
- Consumes: `Menu` is not needed here — the drawer lists items inline
- Produces: `SidebarProps` gains `userMenu?: NavItem[]`, `menu?: React.ReactNode[]`, `showAppInfo?: boolean`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Mobile/Sidebar';

const mockUseLayout = vi.fn();

vi.mock('../../providers', () => ({
  useLayout: () => mockUseLayout(),
  useApp: () => ({ name: 'Test App', version: '1.0.0' }),
}));

describe('Mobile Sidebar', () => {
  beforeEach(() => {
    mockUseLayout.mockReset();
    mockUseLayout.mockReturnValue({ showSidebar: true, setShowSidebar: vi.fn(), secondaryNav: [] });
  });

  it('lists the user menu items', () => {
    render(<Sidebar navItems={[]} userMenu={[{ text: 'Profile', route: '/profile' }]} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders the header menu nodes', () => {
    render(<Sidebar navItems={[]} menu={[<a key="s" href="/settings">Settings</a>]} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('offers sign out', () => {
    render(<Sidebar navItems={[]} />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });
});
```

Mock `@azure/msal-react` and the theme hook the way `UserMenu.test.tsx` already does — read that file
and copy its mocks rather than writing new ones.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- MobileSidebar`
Expected: FAIL — `Sidebar` takes only `navItems`.

- [ ] **Step 3: Write the implementation**

Widen `SidebarProps` in `moo-app/src/layout/Types.ts`:

```ts
export interface SidebarProps {
    navItems?: NavItem[];
    userMenu?: NavItem[];
    menu?: React.ReactNode[];
    showAppInfo?: boolean;
}
```

In `moo-app/src/layout/Mobile/Sidebar.tsx`, add a user section below the existing nav: a divider, the
`userMenu` items through `NavItemList`, the `menu` nodes, the theme toggle and sign out — the same
content `UserMenu` shows on desktop, laid out as drawer rows. Keep the existing `navItems` and
`secondaryNav` blocks untouched.

In `moo-app/src/MooAppLayout.tsx`, pass the header's `userMenu`, `menu` and `showAppInfo` to
`Layout.MobileSidebar` as well as to the headers, so a consumer declares them once.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- MobileSidebar`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add moo-app/src/layout/Mobile/Sidebar.tsx moo-app/src/layout/Types.ts moo-app/src/layout/Layout.tsx moo-app/src/MooAppLayout.tsx moo-app/src/layout/__tests__/MobileSidebar.test.tsx
git commit -m "feat(moo-app): put the user menu in the mobile drawer

The single-bar mobile header drops the identity band, so profile, settings,
theme and sign out move to the drawer rather than disappearing.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

---

### Task 10: UserMenu on Menu, demoo, and release

**Files:**
- Modify: `moo-app/src/layout/UserMenu.tsx`
- Modify: `demoo/src/**` wherever `actions` is passed
- Modify: `moo-app/README.md`

**Interfaces:**
- Consumes: everything above
- Produces: a green `npm run build`, `npm run lint`, `npm run type-check`, `npm run test:run`

- [ ] **Step 1: Move UserMenu onto Menu**

Replace the hand-built `OverlayTrigger`/`Popover`/`<ul>` in `UserMenu.tsx` with `Menu`, `Menu.Item` and `Menu.Divider`, keeping the avatar trigger, the `Popover.Header` content, the theme toggle, sign-out, and the `showAppInfo` block. The existing `UserMenu.test.tsx` must keep passing unchanged — if it does not, the refactor changed behaviour and should be revised rather than the test.

Run: `npm run test:run -- UserMenu`
Expected: PASS, unchanged.

- [ ] **Step 2: Convert demoo**

Find every `actions={...}` in `demoo/src`:

```bash
grep -rn "actions=" demoo/src
```

Convert each node to a `PageAction`. A node that is genuinely a control rather than a command moves to `customActions`.

- [ ] **Step 3: Document the breaking change**

In `moo-app/README.md`, add a short section under the `Page` documentation showing `PageAction`, `customActions`, and a before/after for a consumer upgrading. Keep it to the shape of the change; the reasoning lives in the spec.

- [ ] **Step 4: Verify the whole monorepo**

Run, from the repo root:

```bash
npm run test:run
npm run type-check
npm run lint
npm run build
```

Expected: all four pass. Then `npm run start` and check the demoo pages at 1280px and 390px in the browser: no header overlap at either width, the overflow menu opens on mobile, the desktop actions row is unchanged.

- [ ] **Step 5: Commit and open the PR**

```bash
git add moo-app/src/layout/UserMenu.tsx moo-app/README.md demoo/src
git commit -m "refactor(moo-app): move UserMenu onto Menu; convert demoo actions

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01UMhsYDPBrTkeKYZTvUzBDg"
```

Open the PR against `main`. Merging publishes moo-ds and moo-app via CI — patch number is the commit count, and the PR itself publishes nothing. Note the published version in the PR; MooBank's plan needs it.

---

## Notes for the executor

- **Branch:** create `feature/mobile-shell` from `main` before Task 1.
- **`Fragment` import in Task 7** is flagged in-step; drop it if unused.
- **Do not bump versions by hand.** `package.json` stays at Major.Minor; CI sets the patch.
