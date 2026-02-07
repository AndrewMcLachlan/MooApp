# Feature: Comprehensive Unit Testing for MooApp Monorepo

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

Implement a comprehensive unit testing infrastructure and test suite for all three publishable packages in the MooApp monorepo: `moo-ds` (Design System), `moo-app` (Application Framework), and `moo-icons` (Icon Library). This is a multi-phase effort that establishes testing patterns, creates test utilities, and achieves meaningful code coverage across components, hooks, providers, and utilities.

## User Story

As a library maintainer
I want comprehensive unit tests for all packages
So that I can ensure code quality, prevent regressions, and enable confident refactoring

## Problem Statement

The MooApp monorepo currently has:
- Testing libraries installed (`@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`)
- Setup files (`setupTests.ts`) in each package
- **No actual test configuration** (no Jest or Vitest config)
- **No test scripts** defined in package.json
- **No test files** (except one legacy file in demoo)
- **No test utilities or mocks**
- **No CI/CD test integration**

This creates risk of shipping bugs and makes refactoring dangerous.

## Solution Statement

Implement Vitest as the test runner (optimal for Vite-based projects), create comprehensive test infrastructure with proper mocking strategies, and systematically test all packages in order of complexity: moo-icons → moo-ds → moo-app.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High (multi-phase effort)
**Primary Systems Affected**: moo-icons, moo-ds, moo-app, CI/CD
**Dependencies**: Vitest, @testing-library/react, jsdom, msal-react-tester

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

**Package Configuration:**
- `package.json` (root) - Workspace configuration, Node.js >=22.0.0
- `moo-ds/package.json` - Design system deps, peer deps
- `moo-app/package.json` - App framework deps, MSAL/React Query peer deps
- `moo-icons/package.json` - Icon library (simplest)

**Existing Setup Files:**
- `moo-ds/src/setupTests.ts` - Already imports `@testing-library/jest-dom`
- `moo-app/src/setupTests.ts` - Already imports `@testing-library/jest-dom`

**TypeScript Configuration:**
- `moo-ds/tsconfig.json` - `"types": []` currently excludes test types
- `moo-app/tsconfig.json` - `"types": []` currently excludes test types

**Key Components to Test (moo-ds):**
- `moo-ds/src/components/form/Form.tsx` (lines 1-49) - Compound component pattern with FormProvider
- `moo-ds/src/components/comboBox/ComboBoxProvider.tsx` (lines 1-118) - Complex state management
- `moo-ds/src/providers/ThemeProvider.tsx` (lines 1-46) - localStorage + media query integration
- `moo-ds/src/hooks/useStorage.ts` (lines 1-22) - localStorage abstraction
- `moo-ds/src/hooks/localStorage.ts` - Thin wrapper for useStorage
- `moo-ds/src/utils/dateHelpers.ts` (lines 1-23) - Pure functions: dateOnly, nextSunday, toUrl
- `moo-ds/src/utils/paging.ts` (lines 1-21) - Pure functions: getPagesToDisplay, getNumberOfPages

**Key Components to Test (moo-app):**
- `moo-app/src/providers/HttpClientProvider.tsx` (lines 1-79) - MSAL token interceptor
- `moo-app/src/services/useApiGet.ts` (lines 1-43) - React Query wrapper with httpClient
- `moo-app/src/login/msal.ts` - MSAL singleton factory
- `moo-app/src/MooApp.tsx` - Root component with provider composition

**Key Components to Test (moo-icons):**
- `moo-icons/src/assets/index.ts` - 26 icon exports
- `moo-icons/rollup.config.mjs` - SVGR transformation config

### New Files to Create

**Phase 1 - Infrastructure:**
- `vitest.workspace.ts` - Vitest monorepo workspace config (root)
- `moo-icons/vitest.config.ts` - Icon package test config
- `moo-ds/vitest.config.ts` - Design system test config
- `moo-app/vitest.config.ts` - App framework test config

**Phase 2 - Test Utilities:**
- `moo-ds/src/test-utils/index.ts` - Test utilities export
- `moo-ds/src/test-utils/render.tsx` - Custom render with providers
- `moo-ds/src/test-utils/mocks.ts` - Common mocks (localStorage, matchMedia)
- `moo-app/src/test-utils/index.ts` - Test utilities export
- `moo-app/src/test-utils/render.tsx` - Custom render with all providers
- `moo-app/src/test-utils/mocks.ts` - MSAL, Axios, React Query mocks

**Phase 3 - Tests (moo-icons):**
- `moo-icons/src/__tests__/icons.test.tsx` - All icon tests

**Phase 4 - Tests (moo-ds utilities):**
- `moo-ds/src/utils/__tests__/dateHelpers.test.ts`
- `moo-ds/src/utils/__tests__/paging.test.ts`
- `moo-ds/src/utils/__tests__/sorting.test.ts`
- `moo-ds/src/utils/__tests__/trimEnd.test.ts`

**Phase 5 - Tests (moo-ds hooks):**
- `moo-ds/src/hooks/__tests__/useStorage.test.ts`
- `moo-ds/src/hooks/__tests__/useLocalStorage.test.ts`
- `moo-ds/src/hooks/__tests__/useSessionStorage.test.ts`
- `moo-ds/src/hooks/__tests__/useClickAway.test.ts`

**Phase 6 - Tests (moo-ds providers):**
- `moo-ds/src/providers/__tests__/ThemeProvider.test.tsx`
- `moo-ds/src/providers/__tests__/MessageProvider.test.tsx`
- `moo-ds/src/providers/__tests__/LinkProvider.test.tsx`

**Phase 7 - Tests (moo-ds components - atomic):**
- `moo-ds/src/components/__tests__/Avatar.test.tsx`
- `moo-ds/src/components/__tests__/Icon.test.tsx`
- `moo-ds/src/components/__tests__/IconButton.test.tsx`
- `moo-ds/src/components/__tests__/SearchBox.test.tsx`
- `moo-ds/src/components/__tests__/Breadcrumb.test.tsx`
- (additional atomic component tests)

**Phase 8 - Tests (moo-ds components - compound):**
- `moo-ds/src/components/form/__tests__/Form.test.tsx`
- `moo-ds/src/components/form/__tests__/Input.test.tsx`
- `moo-ds/src/components/form/__tests__/Password.test.tsx`
- `moo-ds/src/components/comboBox/__tests__/ComboBox.test.tsx`
- `moo-ds/src/components/comboBox/__tests__/ComboBoxProvider.test.tsx`

**Phase 9 - Tests (moo-app utilities):**
- `moo-app/src/utils/__tests__/toRoutes.test.ts`
- `moo-app/src/utils/__tests__/createMooAppBrowserRouter.test.ts`

**Phase 10 - Tests (moo-app hooks):**
- `moo-app/src/hooks/__tests__/idParams.test.ts`
- `moo-app/src/hooks/__tests__/pageTitle.test.ts`

**Phase 11 - Tests (moo-app providers):**
- `moo-app/src/providers/__tests__/AppProvider.test.tsx`
- `moo-app/src/providers/__tests__/HttpClientProvider.test.tsx`
- `moo-app/src/providers/__tests__/LayoutProvider.test.tsx`

**Phase 12 - Tests (moo-app services):**
- `moo-app/src/services/__tests__/useApiGet.test.tsx`
- `moo-app/src/services/__tests__/useApiPost.test.tsx`
- `moo-app/src/services/__tests__/processAxiosError.test.ts`
- `moo-app/src/services/__tests__/errorHandler.test.tsx`

**Phase 13 - Tests (moo-app MSAL/Login):**
- `moo-app/src/login/__tests__/msal.test.ts`
- `moo-app/src/login/__tests__/Login.test.tsx`

**Phase 14 - Tests (moo-app Layout):**
- `moo-app/src/layout/__tests__/Layout.test.tsx`
- `moo-app/src/layout/__tests__/UserMenu.test.tsx`

**Phase 15 - Integration & CI:**
- `.github/workflows/build.yml` - Add test step
- Update all package.json files with test scripts

### Relevant Documentation YOU SHOULD READ BEFORE IMPLEMENTING!

- [Vitest Guide](https://vitest.dev/guide/) - Official Vitest documentation
  - [Workspace configuration](https://vitest.dev/guide/workspace.html) - Monorepo setup
  - [Mocking](https://vitest.dev/guide/mocking.html) - vi.mock, vi.spyOn
  - Why: Primary test runner configuration

- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
  - [Custom render](https://testing-library.com/docs/react-testing-library/setup#custom-render) - Provider wrapper setup
  - [User event](https://testing-library.com/docs/user-event/intro) - User interaction simulation
  - Why: Component testing approach

- [MSAL React Tester](https://github.com/Mimetis/msal-react-tester)
  - [Vitest setup](https://github.com/Mimetis/msal-react-tester#vitest) - MSAL mocking for Vitest
  - Why: Required for testing MSAL-authenticated components

- [React Query Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)
  - Why: Testing useApiGet and other query hooks

- [React Hook Form Testing](https://react-hook-form.com/advanced-usage#TestingForm)
  - Why: Testing Form compound components

### Patterns to Follow

**Naming Conventions:**
- Test files: `ComponentName.test.tsx` or `hookName.test.ts`
- Test directories: `__tests__/` within the source directory
- Test utilities: `test-utils/` directory at package src root
- Mock files: `mocks.ts` for reusable mocks

**Component Test Pattern (from Testing Library best practices):**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ComponentName onClick={onClick} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

**Hook Test Pattern:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial value', () => {
    const { result } = renderHook(() => useCustomHook('initial'));
    expect(result.current.value).toBe('initial');
  });
});
```

**Provider Test Pattern (custom render):**
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { MessageProvider } from '../providers/MessageProvider';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <MessageProvider>
      {children}
    </MessageProvider>
  </ThemeProvider>
);

export const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

**localStorage Mock Pattern:**
```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

**matchMedia Mock Pattern:**
```typescript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

---

## IMPLEMENTATION PLAN

### Phase 1: Test Infrastructure Setup

Establish Vitest configuration for the monorepo with proper workspace support, jsdom environment for React component testing, and integration with existing TypeScript configuration.

**Tasks:**
- Install Vitest and required dependencies at root level
- Create workspace configuration for all three packages
- Configure jsdom environment for component testing
- Set up coverage reporting
- Add test scripts to all package.json files

### Phase 2: Test Utilities & Mocks

Create reusable test utilities including custom render functions with provider wrappers, common mocks for localStorage/matchMedia/MSAL, and helper functions for testing patterns specific to this codebase.

**Tasks:**
- Create moo-ds test utilities with provider wrappers
- Create moo-app test utilities with MSAL and React Query mocks
- Set up localStorage and sessionStorage mocks
- Set up matchMedia mock for theme testing
- Create MSAL mock utilities using msal-react-tester

### Phase 3: moo-icons Testing (Simplest)

Test all 26 icon components for proper rendering, prop handling, and accessibility attributes. This is the simplest package and establishes the testing pattern.

**Tasks:**
- Test icon rendering and SVG structure
- Test prop forwarding (className, aria-label, etc.)
- Test currentColor inheritance
- Verify all exports are present

### Phase 4: moo-ds Utility Testing

Test pure utility functions that have no React dependencies - these are the easiest to test and have high value.

**Tasks:**
- Test dateHelpers (dateOnly, nextSunday, toUrl)
- Test paging (getPagesToDisplay, getNumberOfPages)
- Test sorting (changeSortDirection)
- Test trimEnd utility

### Phase 5: moo-ds Hook Testing

Test custom React hooks with proper renderHook usage and mock dependencies.

**Tasks:**
- Test useStorage with mocked Storage API
- Test useLocalStorage and useSessionStorage
- Test useClickAway with DOM event simulation

### Phase 6: moo-ds Provider Testing

Test context providers for proper state management and child component access.

**Tasks:**
- Test ThemeProvider with localStorage and matchMedia mocks
- Test MessageProvider message queue
- Test LinkProvider component injection

### Phase 7: moo-ds Atomic Component Testing

Test simple, single-responsibility components that have minimal state.

**Tasks:**
- Test Avatar, Icon, IconButton, SearchBox, Breadcrumb
- Test Pagination, SortableTh, LoadingTableRows
- Test Tooltip, SpinnerContainer, CloseBadge

### Phase 8: moo-ds Compound Component Testing

Test complex compound components like Form and ComboBox that use context and composition.

**Tasks:**
- Test Form with react-hook-form integration
- Test Form.Input, Form.Password, Form.Select
- Test ComboBox multi-select and single-select modes
- Test ComboBox creation and search functionality

### Phase 9: moo-app Utility Testing

Test routing utilities and helper functions.

**Tasks:**
- Test toRoutes recursive transformation
- Test createMooAppBrowserRouter with mocked React Router

### Phase 10: moo-app Hook Testing

Test application hooks with mocked dependencies.

**Tasks:**
- Test useIdParams with mocked useParams
- Test usePageTitle document.title changes

### Phase 11: moo-app Provider Testing

Test providers with complex dependencies like MSAL and Axios.

**Tasks:**
- Test AppProvider context values
- Test HttpClientProvider with mocked MSAL
- Test LayoutProvider state management

### Phase 12: moo-app Service/API Hook Testing

Test React Query wrapper hooks with mocked httpClient.

**Tasks:**
- Test useApiGet and useApiPagedGet
- Test useApiPost, useApiPut, useApiPatch, useApiDelete
- Test processAxiosError error transformation
- Test errorHandler message display

### Phase 13: moo-app MSAL/Login Testing

Test MSAL initialization and Login component with msal-react-tester.

**Tasks:**
- Test getMsalInstance singleton behavior
- Test Login component authentication redirect

### Phase 14: moo-app Layout Testing

Test layout components with mocked contexts.

**Tasks:**
- Test Layout compound component
- Test UserMenu authentication state
- Test responsive header/sidebar components

### Phase 15: CI/CD Integration

Add test execution to CI pipeline with coverage reporting.

**Tasks:**
- Update GitHub Actions workflow
- Add coverage thresholds
- Configure test result reporting

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### PHASE 1: TEST INFRASTRUCTURE SETUP

---

### Task 1.1: CREATE root vitest dependencies

- **IMPLEMENT**: Install Vitest and testing dependencies at root level
- **IMPORTS**: Add to root package.json devDependencies
- **GOTCHA**: Use `@vitest/coverage-v8` for coverage, not `c8` directly
- **VALIDATE**: `npm install`

```json
{
  "devDependencies": {
    "vitest": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "jsdom": "^26.0.0",
    "happy-dom": "^16.0.0"
  }
}
```

---

### Task 1.2: CREATE vitest.workspace.ts (root)

- **IMPLEMENT**: Create Vitest workspace configuration for monorepo
- **PATTERN**: Vitest workspace configuration pattern
- **GOTCHA**: Each package needs its own vitest.config.ts

```typescript
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'moo-icons/vitest.config.ts',
  'moo-ds/vitest.config.ts',
  'moo-app/vitest.config.ts',
]);
```

- **VALIDATE**: File exists and is valid TypeScript

---

### Task 1.3: CREATE moo-icons/vitest.config.ts

- **IMPLEMENT**: Vitest config for icon package
- **IMPORTS**: vitest/config, @vitejs/plugin-react, @svgr/rollup
- **GOTCHA**: Need svgr plugin to transform SVGs like rollup does

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';

export default defineConfig({
  plugins: [
    svgr({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                cleanupIds: false,
              },
            },
          },
        ],
      },
    }),
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.d.ts'],
    },
  },
});
```

- **VALIDATE**: `npm run test --workspaces=moo-icons` (after adding script)

---

### Task 1.4: CREATE moo-ds/vitest.config.ts

- **IMPLEMENT**: Vitest config for design system package
- **IMPORTS**: vitest/config, @vitejs/plugin-react
- **GOTCHA**: Need to handle CSS imports and PostCSS

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/test-utils/**',
        'src/index.ts',
      ],
    },
    css: true,
  },
});
```

- **VALIDATE**: `npm run test --workspaces=moo-ds` (after adding script)

---

### Task 1.5: CREATE moo-app/vitest.config.ts

- **IMPLEMENT**: Vitest config for app framework package
- **IMPORTS**: vitest/config, @vitejs/plugin-react
- **GOTCHA**: Complex mocking needs for MSAL/Axios/React Query

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/test-utils/**',
        'src/index.ts',
      ],
    },
  },
});
```

- **VALIDATE**: `npm run test --workspaces=moo-app` (after adding script)

---

### Task 1.6: UPDATE moo-ds/src/setupTests.ts

- **IMPLEMENT**: Extend setup file with common mocks
- **PATTERN**: Reference moo-ds/src/setupTests.ts:1
- **IMPORTS**: @testing-library/jest-dom/vitest, vi from vitest

```typescript
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: { ...localStorageMock } });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock document.getElementsByName for ThemeProvider
document.getElementsByName = vi.fn().mockReturnValue([
  { setAttribute: vi.fn() }
]);
```

- **VALIDATE**: File imports correctly in vitest config

---

### Task 1.7: UPDATE moo-app/src/setupTests.ts

- **IMPLEMENT**: Extend setup file with MSAL and common mocks
- **PATTERN**: Reference moo-app/src/setupTests.ts:1
- **IMPORTS**: @testing-library/jest-dom/vitest, vi from vitest

```typescript
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: { ...localStorageMock } });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock document methods
document.getElementsByName = vi.fn().mockReturnValue([
  { setAttribute: vi.fn() }
]);
```

- **VALIDATE**: File imports correctly in vitest config

---

### Task 1.8: UPDATE package.json (root)

- **IMPLEMENT**: Add test scripts to root package.json
- **PATTERN**: Reference package.json:49-55
- **GOTCHA**: Use workspaces for individual package testing

Add to scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

- **VALIDATE**: `npm run test:run`

---

### Task 1.9: UPDATE moo-icons/package.json

- **IMPLEMENT**: Add test scripts
- **PATTERN**: Reference moo-icons/package.json:23-29

Add to scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

- **VALIDATE**: `npm run test:run --workspaces=moo-icons`

---

### Task 1.10: UPDATE moo-ds/package.json

- **IMPLEMENT**: Add test scripts and update devDependencies
- **PATTERN**: Reference moo-ds/package.json:27-34

Add to scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds`

---

### Task 1.11: UPDATE moo-app/package.json

- **IMPLEMENT**: Add test scripts and msal-react-tester dependency
- **PATTERN**: Reference moo-app/package.json:28-35

Add to scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

Add to devDependencies:
```json
{
  "devDependencies": {
    "msal-react-tester": "^3.0.0"
  }
}
```

- **VALIDATE**: `npm run test:run --workspaces=moo-app`

---

### PHASE 2: TEST UTILITIES & MOCKS

---

### Task 2.1: CREATE moo-ds/src/test-utils/mocks.ts

- **IMPLEMENT**: Reusable mocks for moo-ds testing
- **PATTERN**: Mock patterns from setupTests.ts

```typescript
import { vi } from 'vitest';

export const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    _store: store, // For test inspection
  };
};

export const createMatchMediaMock = (matches = false) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

export const mockThemeColorMeta = () => {
  const mockElement = { setAttribute: vi.fn() };
  document.getElementsByName = vi.fn().mockReturnValue([mockElement]);
  return mockElement;
};
```

- **VALIDATE**: File compiles without errors

---

### Task 2.2: CREATE moo-ds/src/test-utils/render.tsx

- **IMPLEMENT**: Custom render function with provider wrappers
- **PATTERN**: Testing Library custom render pattern
- **IMPORTS**: @testing-library/react, providers

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { MessageProvider } from '../providers/MessageProvider';
import { LinkProvider } from '../providers/LinkProvider';

interface AllProvidersProps {
  children: React.ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => (
  <ThemeProvider>
    <MessageProvider>
      <LinkProvider>
        {children}
      </LinkProvider>
    </MessageProvider>
  </ThemeProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
```

- **VALIDATE**: File compiles without errors

---

### Task 2.3: CREATE moo-ds/src/test-utils/index.ts

- **IMPLEMENT**: Export all test utilities

```typescript
export * from './mocks';
export * from './render';
```

- **VALIDATE**: File compiles without errors

---

### Task 2.4: CREATE moo-app/src/test-utils/mocks.ts

- **IMPLEMENT**: MSAL, Axios, and React Query mocks
- **PATTERN**: msal-react-tester integration
- **IMPORTS**: vi from vitest, types from MSAL

```typescript
import { vi } from 'vitest';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Mock Axios instance
export const createAxiosMock = (): Partial<AxiosInstance> => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
  } as any,
  defaults: { headers: { common: {} } } as any,
});

// Mock successful Axios response
export const createAxiosResponse = <T>(data: T, headers = {}): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers,
  config: { headers: {} } as any,
});

// Mock MSAL context
export const createMsalMock = () => ({
  instance: {
    acquireTokenSilent: vi.fn().mockResolvedValue({ accessToken: 'mock-token' }),
    loginRedirect: vi.fn(),
    logoutRedirect: vi.fn(),
    getActiveAccount: vi.fn().mockReturnValue({
      name: 'Test User',
      username: 'test@example.com',
    }),
    getAllAccounts: vi.fn().mockReturnValue([]),
    setActiveAccount: vi.fn(),
  },
  accounts: [],
  inProgress: 'none',
});

// Mock React Query client
export const createQueryClientMock = () => ({
  clear: vi.fn(),
  invalidateQueries: vi.fn(),
  setQueryData: vi.fn(),
  getQueryData: vi.fn(),
});
```

- **VALIDATE**: File compiles without errors

---

### Task 2.5: CREATE moo-app/src/test-utils/render.tsx

- **IMPLEMENT**: Custom render with all moo-app providers
- **PATTERN**: Testing Library custom render pattern
- **IMPORTS**: All providers, React Query, MSAL mock

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { AppProvider } from '../providers/AppProvider';
import { HttpClientContext } from '../providers/HttpClientProvider';
import { ThemeProvider, MessageProvider, LinkProvider } from '@andrewmclachlan/moo-ds';
import { createAxiosMock } from './mocks';

// Create a mock MSAL instance
const mockMsalInstance = {
  initialize: () => Promise.resolve(),
  acquireTokenSilent: () => Promise.resolve({ accessToken: 'mock-token' }),
  loginRedirect: () => Promise.resolve(),
  logoutRedirect: () => Promise.resolve(),
  getActiveAccount: () => ({ name: 'Test User', username: 'test@example.com' }),
  getAllAccounts: () => [],
  setActiveAccount: () => {},
  addEventCallback: () => 'callback-id',
  removeEventCallback: () => {},
} as unknown as PublicClientApplication;

interface AllProvidersProps {
  children: React.ReactNode;
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const AllProviders = ({ children }: AllProvidersProps) => {
  const queryClient = createTestQueryClient();
  const httpClient = createAxiosMock();

  return (
    <MsalProvider instance={mockMsalInstance}>
      <AppProvider name="Test App" version="1.0.0" copyrightYear={2024}>
        <HttpClientContext.Provider value={httpClient as any}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <MessageProvider>
                <LinkProvider>
                  <MemoryRouter>
                    {children}
                  </MemoryRouter>
                </LinkProvider>
              </MessageProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </HttpClientContext.Provider>
      </AppProvider>
    </MsalProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

- **VALIDATE**: File compiles without errors

---

### Task 2.6: CREATE moo-app/src/test-utils/index.ts

- **IMPLEMENT**: Export all test utilities

```typescript
export * from './mocks';
export * from './render';
```

- **VALIDATE**: File compiles without errors

---

### PHASE 3: MOO-ICONS TESTING

---

### Task 3.1: CREATE moo-icons/src/__tests__/icons.test.tsx

- **IMPLEMENT**: Test all 26 icon components
- **PATTERN**: Icon testing pattern from analysis
- **IMPORTS**: All icons, testing-library

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as Icons from '../assets';

// List of all icon names based on exports
const iconNames = [
  'Application', 'BarChart', 'Budget', 'Cog', 'Dashboard', 'Database',
  'HamburgerMenu', 'Hierarchy', 'Import', 'LeftRightArrow', 'PieChart',
  'Piggybank', 'Reports', 'Rules', 'Sliders', 'Stack', 'Tag', 'Tags',
  'Trendline', 'TwoCoins', 'Transaction', 'UpDownArrow', 'User',
  'UserShield', 'Users'
];

describe('moo-icons', () => {
  describe('All icons render correctly', () => {
    iconNames.forEach((iconName) => {
      it(`renders ${iconName} icon`, () => {
        const IconComponent = (Icons as any)[iconName];
        if (!IconComponent) {
          throw new Error(`Icon ${iconName} not found in exports`);
        }

        const { container } = render(<IconComponent data-testid={`icon-${iconName}`} />);
        const svg = container.querySelector('svg');

        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox');
      });
    });
  });

  describe('Icon props', () => {
    it('accepts className prop', () => {
      const { container } = render(<Icons.Dashboard className="custom-class" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveClass('custom-class');
    });

    it('accepts aria-label for accessibility', () => {
      const { container } = render(
        <Icons.User aria-label="User profile icon" role="img" />
      );
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-label', 'User profile icon');
      expect(svg).toHaveAttribute('role', 'img');
    });

    it('accepts width and height props', () => {
      const { container } = render(<Icons.Cog width={48} height={48} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('forwards data-* attributes', () => {
      const { container } = render(<Icons.Dashboard data-testid="test-icon" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('data-testid', 'test-icon');
    });
  });

  describe('Icon structure', () => {
    it('uses currentColor for styling', () => {
      const { container } = render(<Icons.Dashboard />);
      const paths = container.querySelectorAll('path, circle, rect, line');

      // At least some elements should use currentColor
      const usesCurrentColor = Array.from(paths).some(
        (el) => el.getAttribute('stroke') === 'currentColor' ||
                el.getAttribute('fill') === 'currentColor'
      );

      expect(usesCurrentColor).toBe(true);
    });

    it('preserves viewBox attribute', () => {
      const { container } = render(<Icons.Application />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('viewBox');
      expect(svg?.getAttribute('viewBox')).toMatch(/\d+ \d+ \d+ \d+/);
    });
  });

  describe('Package exports', () => {
    it('exports all expected icons', () => {
      iconNames.forEach((iconName) => {
        expect((Icons as any)[iconName]).toBeDefined();
        expect(typeof (Icons as any)[iconName]).toBe('function');
      });
    });
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-icons`

---

### PHASE 4: MOO-DS UTILITY TESTING

---

### Task 4.1: CREATE moo-ds/src/utils/__tests__/dateHelpers.test.ts

- **IMPLEMENT**: Test dateOnly, nextSunday, toUrl functions
- **PATTERN**: Pure function testing
- **IMPORTS**: describe, it, expect from vitest

```typescript
import { describe, it, expect } from 'vitest';
import { dateOnly, nextSunday, toUrl } from '../dateHelpers';

describe('dateHelpers', () => {
  describe('dateOnly', () => {
    it('formats date with default separator', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(dateOnly(date)).toBe('2024-1-15');
    });

    it('formats date with custom separator', () => {
      const date = new Date(2024, 0, 15);
      expect(dateOnly(date, '/')).toBe('2024/1/15');
    });

    it('handles month correctly (0-indexed in JS)', () => {
      const december = new Date(2024, 11, 25); // December 25, 2024
      expect(dateOnly(december)).toBe('2024-12-25');
    });
  });

  describe('nextSunday', () => {
    it('returns same day if already Sunday', () => {
      const sunday = new Date(2024, 0, 7); // January 7, 2024 is Sunday
      const result = nextSunday(sunday);
      expect(result.getDay()).toBe(0); // Sunday
      expect(result.getDate()).toBe(7);
    });

    it('returns next Sunday for Monday', () => {
      const monday = new Date(2024, 0, 8); // January 8, 2024 is Monday
      const result = nextSunday(monday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(14); // Next Sunday
    });

    it('returns next Sunday for Saturday', () => {
      const saturday = new Date(2024, 0, 6); // January 6, 2024 is Saturday
      const result = nextSunday(saturday);
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(7);
    });

    it('accepts string date input', () => {
      const result = nextSunday('2024-01-08'); // Monday
      expect(result.getDay()).toBe(0);
    });

    it('resets time to midnight', () => {
      const date = new Date(2024, 0, 8, 14, 30, 45);
      const result = nextSunday(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe('toUrl', () => {
    it('formats date for URL with / separator', () => {
      const monday = new Date(2024, 0, 8);
      const result = toUrl(monday);
      expect(result).toBe('2024/1/14'); // Next Sunday
    });

    it('works with Sunday input', () => {
      const sunday = new Date(2024, 0, 7);
      const result = toUrl(sunday);
      expect(result).toBe('2024/1/7');
    });
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="dateHelpers"`

---

### Task 4.2: CREATE moo-ds/src/utils/__tests__/paging.test.ts

- **IMPLEMENT**: Test getPagesToDisplay and getNumberOfPages
- **PATTERN**: Pure function testing

```typescript
import { describe, it, expect } from 'vitest';
import { getPagesToDisplay, getNumberOfPages } from '../paging';

describe('paging', () => {
  describe('getNumberOfPages', () => {
    it('calculates pages correctly', () => {
      expect(getNumberOfPages(100, 10)).toBe(10);
      expect(getNumberOfPages(101, 10)).toBe(11);
      expect(getNumberOfPages(99, 10)).toBe(10);
    });

    it('returns at least 1 page', () => {
      expect(getNumberOfPages(0, 10)).toBe(1);
    });

    it('handles single item', () => {
      expect(getNumberOfPages(1, 10)).toBe(1);
    });

    it('handles exact page size', () => {
      expect(getNumberOfPages(50, 50)).toBe(1);
    });
  });

  describe('getPagesToDisplay', () => {
    describe('with 5 or fewer pages', () => {
      it('shows all pages when total is 5', () => {
        expect(getPagesToDisplay(1, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(3, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(5, 5)).toEqual([1, 2, 3, 4, 5]);
      });

      it('shows all pages when total is less than 5', () => {
        expect(getPagesToDisplay(1, 3)).toEqual([1, 2, 3]);
        expect(getPagesToDisplay(2, 3)).toEqual([1, 2, 3]);
      });
    });

    describe('with more than 5 pages', () => {
      it('shows first 5 when on early pages', () => {
        expect(getPagesToDisplay(1, 10)).toEqual([1, 2, 3, 4, 5]);
        expect(getPagesToDisplay(2, 10)).toEqual([1, 2, 3, 4, 5]);
      });

      it('shows last 5 when on late pages', () => {
        expect(getPagesToDisplay(10, 10)).toEqual([6, 7, 8, 9, 10]);
        expect(getPagesToDisplay(8, 10)).toEqual([6, 7, 8, 9, 10]);
      });

      it('centers around current page in middle', () => {
        expect(getPagesToDisplay(5, 10)).toEqual([3, 4, 5, 6, 7]);
        expect(getPagesToDisplay(6, 10)).toEqual([4, 5, 6, 7, 8]);
      });
    });
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="paging"`

---

### Task 4.3: CREATE moo-ds/src/utils/__tests__/sorting.test.ts

- **IMPLEMENT**: Test changeSortDirection utility
- **PATTERN**: Pure function testing

```typescript
import { describe, it, expect } from 'vitest';
import { changeSortDirection } from '../sorting';
import { SortDirection } from '../../models';

describe('sorting', () => {
  describe('changeSortDirection', () => {
    it('changes Ascending to Descending', () => {
      expect(changeSortDirection(SortDirection.Ascending)).toBe(SortDirection.Descending);
    });

    it('changes Descending to Ascending', () => {
      expect(changeSortDirection(SortDirection.Descending)).toBe(SortDirection.Ascending);
    });

    it('handles None by returning Ascending', () => {
      expect(changeSortDirection(SortDirection.None)).toBe(SortDirection.Ascending);
    });
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="sorting"`

---

### Task 4.4: CREATE moo-ds/src/utils/__tests__/trimEnd.test.ts

- **IMPLEMENT**: Test trimEnd utility

```typescript
import { describe, it, expect } from 'vitest';
import { trimEnd } from '../trimEnd';

describe('trimEnd', () => {
  it('trims specified character from end', () => {
    expect(trimEnd('hello/', '/')).toBe('hello');
  });

  it('trims multiple occurrences', () => {
    expect(trimEnd('hello///', '/')).toBe('hello');
  });

  it('does not trim from start', () => {
    expect(trimEnd('/hello/', '/')).toBe('/hello');
  });

  it('returns same string if character not at end', () => {
    expect(trimEnd('hello', '/')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(trimEnd('', '/')).toBe('');
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="trimEnd"`

---

### PHASE 5: MOO-DS HOOK TESTING

---

### Task 5.1: CREATE moo-ds/src/hooks/__tests__/useStorage.test.ts

- **IMPLEMENT**: Test useStorage hook with mocked Storage API
- **PATTERN**: Hook testing with renderHook

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStorage } from '../useStorage';

describe('useStorage', () => {
  let mockStorage: Storage;

  beforeEach(() => {
    const store: Record<string, string> = {};
    mockStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: vi.fn((key: string) => { delete store[key]; }),
      clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
      get length() { return Object.keys(store).length; },
      key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    };
  });

  it('returns initial value when storage is empty', () => {
    const { result } = renderHook(() => useStorage(mockStorage, 'testKey', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when present', () => {
    (mockStorage.getItem as any).mockReturnValue(JSON.stringify('stored'));
    const { result } = renderHook(() => useStorage(mockStorage, 'testKey', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates storage when value changes', () => {
    const { result } = renderHook(() => useStorage(mockStorage, 'testKey', 'initial'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(mockStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('newValue'));
    expect(result.current[0]).toBe('newValue');
  });

  it('handles function updater', () => {
    const { result } = renderHook(() => useStorage(mockStorage, 'counter', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('stores objects correctly', () => {
    const { result } = renderHook(() => useStorage(mockStorage, 'obj', { a: 1 }));

    act(() => {
      result.current[1]({ a: 2, b: 3 });
    });

    expect(mockStorage.setItem).toHaveBeenCalledWith('obj', JSON.stringify({ a: 2, b: 3 }));
  });

  it('accepts initializer function', () => {
    const initializer = vi.fn(() => 'computed');
    const { result } = renderHook(() => useStorage(mockStorage, 'key', initializer));

    // Initial value should come from storage check, not initializer directly
    // (initializer is only called if storage returns null)
    expect(result.current[0]).toBe('computed');
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="useStorage"`

---

### Task 5.2: CREATE moo-ds/src/hooks/__tests__/useClickAway.test.ts

- **IMPLEMENT**: Test useClickAway hook with DOM events
- **PATTERN**: Hook testing with DOM simulation

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickAway } from '../clickAway';

describe('useClickAway', () => {
  it('calls callback when clicking outside element', () => {
    const callback = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useClickAway(ref, callback));

    // Click outside the element
    const event = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(ref.current);
  });

  it('does not call callback when clicking inside element', () => {
    const callback = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useClickAway(ref, callback));

    // Click inside the element
    const event = new MouseEvent('mousedown', { bubbles: true });
    ref.current.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
  });

  it('cleans up event listener on unmount', () => {
    const callback = vi.fn();
    const ref = { current: document.createElement('div') };
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useClickAway(ref, callback));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('handles null ref', () => {
    const callback = vi.fn();
    const ref = { current: null };

    // Should not throw
    expect(() => {
      renderHook(() => useClickAway(ref, callback));
    }).not.toThrow();
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="useClickAway"`

---

### PHASE 6: MOO-DS PROVIDER TESTING

---

### Task 6.1: CREATE moo-ds/src/providers/__tests__/ThemeProvider.test.tsx

- **IMPLEMENT**: Test ThemeProvider with localStorage and matchMedia mocks
- **PATTERN**: Provider testing with context access

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// Test component to access context
const ThemeConsumer = () => {
  const { theme, setTheme, defaultTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-name">{theme?.name}</span>
      <span data-testid="default-theme">{defaultTheme?.name}</span>
      <button onClick={() => setTheme?.({ name: 'Dark', theme: 'dark', colour: '#000' })}>
        Set Dark
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.className = '';
  });

  it('provides theme context to children', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-name')).toBeInTheDocument();
  });

  it('uses default theme based on system preference', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // matchMedia is mocked to return matches: false (light mode)
    expect(screen.getByTestId('default-theme')).toHaveTextContent('Light');
  });

  it('allows theme to be changed', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByText('Set Dark').click();
    });

    expect(screen.getByTestId('theme-name')).toHaveTextContent('Dark');
  });

  it('persists theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByText('Set Dark').click();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'theme',
      expect.stringContaining('Dark')
    );
  });

  it('sets body class based on theme', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByText('Set Dark').click();
    });

    expect(document.body.getAttribute('class')).toBe('dark');
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="ThemeProvider"`

---

### Task 6.2: CREATE moo-ds/src/providers/__tests__/MessageProvider.test.tsx

- **IMPLEMENT**: Test MessageProvider message queue functionality
- **PATTERN**: Provider testing with context access

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MessageProvider, useMessages } from '../MessageProvider';

const MessageConsumer = () => {
  const { addMessage, messages, clearMessages } = useMessages();
  return (
    <div>
      <span data-testid="message-count">{messages?.length ?? 0}</span>
      <button onClick={() => addMessage?.({ text: 'Test message', type: 'success' })}>
        Add Message
      </button>
      <button onClick={() => clearMessages?.()}>Clear</button>
      {messages?.map((m, i) => (
        <span key={i} data-testid={`message-${i}`}>{m.text}</span>
      ))}
    </div>
  );
};

describe('MessageProvider', () => {
  it('provides message context to children', () => {
    render(
      <MessageProvider>
        <MessageConsumer />
      </MessageProvider>
    );

    expect(screen.getByTestId('message-count')).toHaveTextContent('0');
  });

  it('allows adding messages', async () => {
    render(
      <MessageProvider>
        <MessageConsumer />
      </MessageProvider>
    );

    await act(async () => {
      screen.getByText('Add Message').click();
    });

    expect(screen.getByTestId('message-count')).toHaveTextContent('1');
    expect(screen.getByTestId('message-0')).toHaveTextContent('Test message');
  });

  it('allows clearing messages', async () => {
    render(
      <MessageProvider>
        <MessageConsumer />
      </MessageProvider>
    );

    await act(async () => {
      screen.getByText('Add Message').click();
      screen.getByText('Add Message').click();
    });

    expect(screen.getByTestId('message-count')).toHaveTextContent('2');

    await act(async () => {
      screen.getByText('Clear').click();
    });

    expect(screen.getByTestId('message-count')).toHaveTextContent('0');
  });
});
```

- **VALIDATE**: `npm run test:run --workspaces=moo-ds -- --testNamePattern="MessageProvider"`

---

### PHASE 7-8: COMPONENT TESTING (Summary - expand as needed)

The remaining phases follow the same patterns established above. Key notes:

**For atomic components (Phase 7):**
- Test rendering with default props
- Test prop variations (className, disabled, etc.)
- Test event handlers (onClick, onChange)
- Use snapshot tests sparingly for complex DOM

**For compound components (Phase 8):**
- Wrap in necessary providers (FormProvider for Form components)
- Test sub-component composition (Form.Input within Form)
- Test state management and callbacks

---

### PHASE 9-14: MOO-APP TESTING (Summary)

**Key patterns for moo-app:**

1. **API Hooks (Phase 12)**: Use React Query's test utilities:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <HttpClientContext.Provider value={mockAxios}>
        {children}
      </HttpClientContext.Provider>
    </QueryClientProvider>
  );
};
```

2. **MSAL Testing (Phase 13)**: Use msal-react-tester:
```typescript
import { MsalReactTester } from 'msal-react-tester';

let msalTester: MsalReactTester;

beforeEach(() => {
  msalTester = new MsalReactTester();
  msalTester.spyMsal();
});

afterEach(() => {
  msalTester.resetSpyMsal();
});
```

---

### PHASE 15: CI/CD INTEGRATION

---

### Task 15.1: UPDATE .github/workflows/build.yml

- **IMPLEMENT**: Add test step to CI pipeline
- **PATTERN**: Reference .github/workflows/build.yml

Add before the build step:
```yaml
- name: Run tests
  run: npm run test:run

- name: Run tests with coverage
  run: npm run test:coverage
```

- **VALIDATE**: Push to branch and verify GitHub Actions runs tests

---

## TESTING STRATEGY

### Unit Tests

- **Utilities**: 100% coverage - pure functions are easy to test completely
- **Hooks**: Focus on state changes and side effects
- **Providers**: Test context values and state management
- **Components**: Test user interactions and rendering

### Integration Tests

- Form submission flows
- ComboBox selection workflows
- Theme switching persistence

### Edge Cases

- Empty/null/undefined inputs to utilities
- Error states in API hooks
- MSAL token acquisition failures
- localStorage unavailable

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npm run lint
```

### Level 2: Unit Tests

```bash
npm run test:run
```

### Level 3: Coverage

```bash
npm run test:coverage
```

### Level 4: Individual Package Tests

```bash
npm run test:run --workspaces=moo-icons
npm run test:run --workspaces=moo-ds
npm run test:run --workspaces=moo-app
```

### Level 5: Watch Mode (Development)

```bash
npm run test
```

---

## ACCEPTANCE CRITERIA

- [x] Vitest configured for all three packages
- [x] Test scripts added to all package.json files
- [x] moo-icons: All 25 icons tested (rendering, props, accessibility) - 126 tests
- [x] moo-ds utilities: 100% coverage on pure functions - 64 tests
- [x] moo-ds hooks: All hooks tested (useStorage, useClickAway, etc.) - 70 tests
- [x] moo-ds providers: ThemeProvider, MessageProvider, LinkProvider tested - 44 tests
- [x] moo-ds components: Form, ComboBox, Section, Pagination tested - 138 tests
- [x] moo-app: API hooks tested with mocked httpClient - 74 tests
- [x] moo-app: Login and AppProvider tested - 30 tests
- [ ] CI/CD: Tests run on every PR
- [ ] Overall coverage: >60% on first pass, path to >80%

---

## COMPLETION CHECKLIST

- [x] Phase 1: Infrastructure setup complete
- [x] Phase 2: Test utilities created (moo-ds + moo-app test-utils)
- [x] Phase 3: moo-icons tests passing (126 tests for 25 icons)
- [x] Phase 4: moo-ds utilities tests passing (64 tests)
- [x] Phase 5: moo-ds hooks tests passing (70 tests)
- [x] Phase 6: moo-ds providers tests passing (44 tests)
- [x] Phase 7: moo-ds simple components tests passing (66 tests)
- [x] Phase 8: moo-ds complex components tests passing (72 tests)
- [x] Phase 9: moo-app HTTP/API tests passing (74 tests)
- [x] Phase 10: moo-app Auth tests passing (30 tests)
- [ ] Phase 11: moo-app Component tests
- [ ] Phase 12: moo-app Router tests
- [ ] Phase 13: moo-app Error Boundary tests
- [ ] Phase 14: Integration tests
- [ ] Phase 15: CI/CD integration complete
- [ ] All validation commands pass
- [ ] Coverage thresholds met

**Current Total: 546 tests passing**

---

## NOTES

### Framework Choice: Vitest over Jest

Vitest was chosen over Jest because:
1. Native ESM support (moo-app uses ES modules)
2. 10x faster execution (important for developer experience)
3. Built-in Vite config reuse (already using Vite for dev)
4. Better TypeScript support out of the box
5. Compatible workspace configuration for monorepos

### Testing Priority

The phases are ordered by:
1. **Infrastructure first** - Must have test runner before tests
2. **Simplest to complex** - moo-icons → moo-ds → moo-app
3. **Pure functions first** - Utilities are easiest to test
4. **Providers before consumers** - Test providers before components that use them

### MSAL Complexity

MSAL testing is complex due to:
- Singleton instance management
- Token acquisition flows
- Error handling for various auth scenarios
- Event callback system

The msal-react-tester library is specifically designed to handle these complexities.

### Design Decisions

1. **`__tests__` directories**: Tests live next to source for easier navigation
2. **Separate test-utils**: Reusable utilities prevent duplication
3. **Coverage thresholds**: Start at 60%, increase as patterns stabilize
4. **CI before full coverage**: Get tests running in CI early, add coverage later
