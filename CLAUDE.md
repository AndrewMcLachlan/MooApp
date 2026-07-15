# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

This is an npm workspaces monorepo. All commands are run from the repository root.

```bash
npm run build           # Build all packages
npm run lint            # Lint all packages
npm run lint-fix        # Lint and fix all packages
npm run start           # Run demoo dev server (alias: npm run demoo)
```

To run commands for a specific workspace, use the `-w` flag with the package name:
```bash
npm run build -w @andrewmclachlan/moo-app
npm run build -w @andrewmclachlan/moo-ds
npm run build -w @andrewmclachlan/moo-icons
```

Storybook (documentation site):
```bash
npm run storybook -w @andrewmclachlan/storybook  # Runs on port 6006
```

## Architecture

The repository contains three publishable packages that layer on top of each other:

### @andrewmclachlan/moo-ds (Design System)
Foundation UI component library with no authentication dependencies:
- Custom components (forms, pagination, tables, icons) styled by the design
  system's own CSS under `moo-ds/src/css/` (a Bootstrap-class-contract layer;
  there is no `react-bootstrap` dependency)
- Layout components (Section, Alerts, Notifications)
- ComboBox compound component pattern
- Theme and Link providers for customization (themes are extensible — pass a
  `themes` list to `ThemeProvider`)
- Utility hooks (useLocalStorage, useSessionStorage, useClickAway)

### @andrewmclachlan/moo-app (Application Framework)
Builds on moo-ds to provide a complete authenticated SPA framework:
- **MooApp**: Root component that wires up MSAL authentication, React Query, and providers. Takes the app's axios `client` (typically a [hey-api](https://heyapi.dev) generated client's `.instance`) and attaches MSAL auth to it. MSAL is configurable via the `auth` prop (authority/tenant, redirect URIs, cache, login scopes) and defaults to the framework's built-in config.
- **MooAppLayout**: Standard app shell with header, sidebar, and error boundaries
- **MsalAuthProvider**: Attaches an MSAL access-token request interceptor to the supplied axios instance (silent acquisition with an interactive-redirect fallback). Also exports `addMsalInterceptor` for imperative use (e.g. the internal MS Graph client).
- **Data fetching**: apps generate their API client and React Query hooks with hey-api (`@hey-api/openapi-ts` + `@hey-api/client-axios` + the `@tanstack/react-query` plugin). moo-app no longer ships its own `useApiGet/Post/...` hooks or an axios client factory — hey-api owns the client and the query/mutation hooks.
- **Routing**: uses `@tanstack/react-router`. The consumer builds the route tree with TanStack's `createRoute`/`createRouter` and passes the router to `MooApp` via the `router` prop (see `moo-app/README.md` for a recipe, and `demoo/src/index.tsx` for a full example). There is no `createMooAppBrowserRouter` helper.

### @andrewmclachlan/moo-icons
SVG icons compiled as React components via SVGR.

### demoo
Demo application showcasing the libraries.

## Key Patterns

**Provider hierarchy in MooApp**: AppProvider → ThemeProvider → MsalProvider → MsalAuthProvider → QueryClientProvider (or PersistQueryClientProvider) → LinkProvider → MessageProvider → Login → RouterProvider

(ThemeProvider sits at the root — above the auth boundary — so the unauthenticated Login/fallback screen is themed too.)

**Auth token injection**: `MsalAuthProvider` attaches a request interceptor to the app's axios client that acquires an MSAL access token silently per request (falling back to an interactive redirect on a recoverable auth error). The hey-api generated client uses that same instance, so all generated SDK/React Query calls are authenticated automatically.

**Build tooling**: Libraries use Vite library mode to output ESM with TypeScript declarations (via vite-plugin-dts). Peer dependencies are externalized via rollup-plugin-peer-deps-external.

**Dev workflow**: demoo and storybook resolve `@andrewmclachlan/moo-*` imports directly to library source via Vite aliases — no rebuild needed for library changes to flow through.

## Code Style

**No inline styles**: Always use CSS classes instead of inline `style` attributes. If a class doesn't exist for the styling you need, create one in the appropriate CSS file.

## Requirements

- Node.js >= 22.0.0
- React >= 19.0.0
