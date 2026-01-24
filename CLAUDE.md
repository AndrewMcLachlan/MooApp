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

To run commands for a specific workspace:
```bash
npm run build --workspaces=moo-app
npm run build --workspaces=moo-ds
npm run build --workspaces=moo-icons
```

Storybook (documentation site):
```bash
npm run storybook --workspaces=storybook  # Runs on port 6006
```

## Architecture

The repository contains three publishable packages that layer on top of each other:

### @andrewmclachlan/moo-ds (Design System)
Foundation UI component library with no authentication dependencies:
- React Bootstrap-based components (forms, pagination, tables, icons)
- Layout components (Section, Alerts, Notifications)
- ComboBox compound component pattern
- Theme and Link providers for customization
- Utility hooks (useLocalStorage, useSessionStorage, useClickAway)

### @andrewmclachlan/moo-app (Application Framework)
Builds on moo-ds to provide a complete authenticated SPA framework:
- **MooApp**: Root component that wires up MSAL authentication, React Query, and providers
- **MooAppLayout**: Standard app shell with header, sidebar, and error boundaries
- **HttpClientProvider**: Axios client with automatic MSAL token injection
- **API hooks**: useApiGet, useApiPost, useApiPut, useApiPatch, useApiDelete wrapping React Query
- **createMooAppBrowserRouter**: Utility to convert route definitions to React Router format

### @andrewmclachlan/moo-icons
SVG icons compiled as React components via Rollup/SVGR.

### demoo
Demo application showcasing the libraries.

## Key Patterns

**Provider hierarchy in MooApp**: AppProvider → MsalProvider → HttpClientProvider → QueryClientProvider → LinkProvider → MessageProvider

**API hooks**: All API hooks use React Query and automatically acquire MSAL tokens via HttpClientProvider interceptors.

**Build tooling**: Libraries use Rollup to output both CJS and ESM formats with TypeScript declarations.

## Requirements

- Node.js >= 22.0.0
- React >= 19.0.0
