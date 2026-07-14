# @andrewmclachlan/moo-app

An opinionated, complete authenticated SPA framework built on [`@andrewmclachlan/moo-ds`](../moo-ds/README.md).

![Build](https://github.com/andrewmclachlan/mooapp/actions/workflows/build.yml/badge.svg)

## What it provides

- **`MooApp`** — a root component that wires the whole provider stack: MSAL auth, React Query (optionally persisted), the HTTP client, link/message/theme providers, the login flow, and the router.
- **Authentication** — MSAL (`@azure/msal-browser` / `@azure/msal-react`) with automatic silent-token acquisition and interactive-redirect fallback. Configurable via the `auth` prop (see below).
- **Data** — `HttpClientProvider` (an Axios client that injects MSAL tokens automatically) and React Query hooks: `useApiGet`, `useApiPagedGet`, `useApiPost`, `useApiPut`, `useApiPatch`, `useApiDelete` (plus `Empty`/`File` variants).
- **Layout** — `MooAppLayout`, a standard app shell (header, sidebar, footer, error boundaries) with desktop and mobile variants.
- **Routing** — uses [`@tanstack/react-router`](https://tanstack.com/router). You build the route tree and pass the router to `MooApp` (recipe below).

## Peer dependencies

- `react` and `react-dom` (>= 19.2.7)
- `@andrewmclachlan/moo-ds` (>= 4.0.0)
- `@azure/msal-react` — authentication
- `@tanstack/react-query`, `@tanstack/react-query-persist-client` — data / caching
- `@tanstack/react-router` — routing
- `react-hook-form` — forms (via moo-ds)
- FontAwesome (`@fortawesome/*`) for the icon layer

## Configuring authentication

MSAL defaults to the framework's built-in configuration, but you can override it with the `auth` prop:

```tsx
<MooApp
  clientId="<your-app-registration-client-id>"
  auth={{
    authority: "https://login.microsoftonline.com/<your-tenant-id>",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    cacheLocation: "localStorage",
    loginScopes: ["openid", "profile"],
  }}
  baseUrl="/api"
  router={router}
/>
```

Every field is optional and falls back to the default, so single-tenant apps can omit `auth` entirely.

## Routing recipe

There is **no `createMooAppBrowserRouter` helper** — build a standard TanStack router and hand it to `MooApp`:

```tsx
import { MooApp } from "@andrewmclachlan/moo-app";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Home } from "./routes/Home";

const rootRoute = createRootRoute({ component: App });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });

const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MooApp clientId="<client-id>" baseUrl="/api" router={router} name="My App" />
);
```

See [`demoo/src/index.tsx`](../demoo/src/index.tsx) for a complete, multi-route example.

## Avoiding `block_iframe_reload`

MSAL renews tokens in a hidden iframe. If the app re-bootstraps inside that iframe you can hit `block_iframe_reload`. Point silent token requests at a minimal `blank.html` so the iframe doesn't reload the full app — see the app-registration redirect-URI notes in the MSAL docs.
