# MooApp - Product Requirements Document

## Executive Summary

MooApp is an opinionated React component library and application framework designed to accelerate the development of enterprise Line of Business (LoB) web applications. It provides a complete, batteries-included solution for building authenticated single-page applications with Azure AD integration, REST API connectivity, and professional UI components.

The library is built on React 19, React Bootstrap, and TypeScript, offering a layered architecture: a foundational design system (moo-ds), an application framework with authentication and data fetching (moo-app), and a custom icon library (moo-icons). This approach allows developers to use components at any level of abstraction based on their needs.

The core value proposition is reducing boilerplate and standardizing patterns for enterprise React applications, enabling teams to focus on business logic rather than infrastructure concerns like authentication, API token management, form handling, and responsive layouts.

## Mission

**Mission Statement:** Provide a cohesive, well-designed React framework that enables rapid development of enterprise web applications with consistent UX patterns, built-in Azure AD authentication, and production-ready components.

**Core Principles:**
1. **Opinionated but Flexible** - Provide sensible defaults while allowing customization where needed
2. **Layered Architecture** - Allow consumption at design system, framework, or full-stack levels
3. **Enterprise-Ready** - Include authentication, error handling, and accessibility out of the box
4. **Developer Experience** - Reduce boilerplate with compound components, hooks, and context providers
5. **Modern Stack** - Leverage React 19+, TypeScript, and current best practices

## Target Users

**Primary Persona: Enterprise React Developer**
- Building internal business applications for organizations using Azure AD
- Comfortable with React, TypeScript, and modern tooling
- Needs to deliver applications quickly with consistent quality
- Values type safety and well-documented APIs

**Secondary Persona: Frontend Team Lead**
- Establishing patterns and component libraries for team consistency
- Evaluating frameworks that reduce onboarding time for new developers
- Needs theming and customization for brand compliance

**Key User Needs:**
- Pre-built authentication flow with Azure AD
- Consistent layout patterns (header, sidebar, responsive design)
- Form components with validation integration
- Data fetching hooks with automatic token injection
- Professional UI components (tables, pagination, search, modals)

## MVP Scope

### In Scope

**Core Design System (moo-ds)**
- ✅ Form components (Input, Select, TextArea, Password, Check, ComboBox)
- ✅ Layout components (Section, SectionHeader, SectionBody, SectionRow)
- ✅ Table components (Pagination, SortableTh, LoadingTableRows, PageSize)
- ✅ Data display (Avatar, Icon, Breadcrumb, Badge, SearchBox)
- ✅ Interactive components (Upload, Collapsible, TagPanel, Tooltip)
- ✅ Theme system with multiple built-in themes (Light, Dark, Dark Blue, Light Red, System)
- ✅ Context providers (ThemeProvider, MessageProvider, LinkProvider)
- ✅ Utility hooks (useLocalStorage, useSessionStorage, useClickAway)

**Application Framework (moo-app)**
- ✅ MooApp root component with provider hierarchy
- ✅ MooAppLayout with header, sidebar, and error boundaries
- ✅ MSAL authentication integration (Azure AD)
- ✅ HttpClientProvider with automatic token injection
- ✅ API hooks (useApiGet, useApiPost, useApiPut, useApiPatch, useApiDelete)
- ✅ Paged result handling with useApiPagedGet
- ✅ Desktop and mobile responsive layouts
- ✅ Page component with title, breadcrumbs, and actions
- ✅ Error and NotFound pages
- ✅ Microsoft Graph integration (user photo)

**Icon Library (moo-icons)**
- ✅ Custom SVG icons as React components
- ✅ Icons for common business app concepts (Dashboard, Reports, Settings, Users, etc.)

**Technical**
- ✅ TypeScript definitions for all components
- ✅ Rollup build outputting CJS and ESM
- ✅ CSS with custom properties for theming
- ✅ React 19 compatibility
- ✅ npm workspaces monorepo structure

### Out of Scope

**Deferred Features**
- ❌ Unit test suite for components
- ❌ Visual regression testing
- ❌ Independence from Bootstrap and React Bootstrap
- ❌ Alternative authentication providers (Auth0, Okta, etc.)
- ❌ Data grid component with inline editing
- ❌ CLI scaffolding tool

## User Stories

### Application Developer Stories

**US1: Bootstrap Authenticated App**
> As a developer, I want to wrap my app with MooApp component, so that I get Azure AD authentication, React Query, and routing configured automatically.

*Example:*
```tsx
<MooApp clientId="xxx" scopes={["api://xxx/.default"]} baseUrl="/api">
  <RouterProvider router={router} />
</MooApp>
```

**US2: Fetch Authenticated API Data**
> As a developer, I want to use useApiGet hook, so that I can fetch data from my API with automatic token injection and caching.

*Example:*
```tsx
const { data, isLoading } = useApiGet<User[]>(["users"], "/users");
```

**US3: Build Forms with Validation**
> As a developer, I want to use Form compound components, so that I can build forms with React Hook Form integration and consistent styling.

*Example:*
```tsx
<Form onSubmit={handleSubmit}>
  <Form.Group>
    <Form.Label>Email</Form.Label>
    <Form.Input name="email" required />
  </Form.Group>
</Form>
```

**US4: Implement Standard Layout**
> As a developer, I want to use MooAppLayout with header and sidebar props, so that I get a responsive layout with navigation without building it from scratch.

**US5: Display Paginated Tables**
> As a developer, I want to use Pagination and SortableTh components, so that I can build sortable, paginated data tables with consistent UX.

**US6: Show User Notifications**
> As a developer, I want to use the message context, so that I can show success/error/warning alerts to users.

### End User Stories

**US7: Theme Preference**
> As an end user, I want to select my preferred theme (light/dark), so that the application respects my visual preferences.

**US8: Mobile Navigation**
> As an end user on mobile, I want the navigation to adapt to my screen size, so that I can use the application on my phone.

## Core Architecture & Patterns

### Package Hierarchy

```
@andrewmclachlan/moo-ds     (Design System - no auth dependencies)
        ↑
@andrewmclachlan/moo-app    (App Framework - adds auth, routing, API)
        ↑
@andrewmclachlan/moo-icons  (Icon Library - standalone)
        ↑
    demoo                    (Demo Application)
```

### Provider Architecture

MooApp establishes a nested provider hierarchy:

```
AppProvider (name, version, copyright)
  └── MsalProvider (Azure AD authentication)
       └── HttpClientProvider (Axios with token interceptor)
            └── QueryClientProvider (React Query)
                 └── LinkProvider (Router abstraction)
                      └── MessageProvider (Alerts/toasts)
                           └── Login (Auth gate)
                                └── RouterProvider (React Router)
```

### Key Design Patterns

**Compound Components**
Used for Form, ComboBox, Section, and Layout to provide flexible composition:
```tsx
<Section>
  <Section.Header>Title</Section.Header>
  <Section.Body>Content</Section.Body>
</Section>
```

**Context Providers**
All cross-cutting concerns (theme, messages, layout state, http client) are provided via React Context with custom hooks for consumption.

**Custom Hooks for Data Fetching**
API hooks wrap React Query and inject authentication automatically:
- `useApiGet` / `useApiPagedGet` - Query hooks
- `useApiPost` / `useApiPut` / `useApiPatch` / `useApiDelete` - Mutation hooks

**CSS Custom Properties**
Theming uses CSS variables for runtime theme switching without rebuilds.

### Directory Structure

```
moo-ds/
├── src/
│   ├── components/       # UI components
│   │   ├── form/         # Form compound components
│   │   └── comboBox/     # ComboBox compound components
│   ├── layout/           # Section, SectionForm, etc.
│   ├── hooks/            # Utility hooks
│   ├── models/           # TypeScript interfaces
│   ├── providers/        # Context providers
│   ├── css/              # Styles and themes
│   └── utils/            # Helper functions

moo-app/
├── src/
│   ├── layout/           # Desktop/Mobile Header, Sidebar, Footer
│   ├── login/            # MSAL configuration
│   ├── providers/        # HttpClient, Layout, App providers
│   ├── services/         # API hooks
│   ├── pages/            # Page, Dashboard, Error, NotFound
│   └── models/           # Route, Layout types
```

## Tools/Features

### Form System

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| Form | Wrapper with React Hook Form | `onSubmit`, `horizontal`/`vertical` layout |
| Form.Input | Text input | Auto type conversion, `type="number"` support |
| Form.Password | Password field | Visibility toggle |
| Form.Select | Dropdown | Standard HTML select |
| Form.TextArea | Multi-line | Resizable |
| Form.Check | Checkbox/Radio | Bootstrap styling |
| Form.Group | Field container | Label association |
| FormComboBox | Advanced select | Multi-select, creatable, searchable |

### ComboBox System

Compound component with provider pattern supporting:
- Single and multi-select modes
- Searchable/filterable items
- Creatable (add new items on-the-fly)
- Clearable selection
- Custom label/value field mapping
- Color field support for visual tags

### Layout System

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Header | Top bar with logo, search, user menu | Simplified with hamburger |
| Sidebar | Collapsible left navigation | Bottom sheet overlay |
| Footer | Standard footer | Adapted |
| Page | Title, breadcrumbs, actions | Responsive |

### API Hooks

| Hook | HTTP Method | Use Case |
|------|-------------|----------|
| `useApiGet<T>` | GET | Fetch single resource |
| `useApiPagedGet<T>` | GET | Fetch with `x-total-count` header |
| `useApiPost<R,V,D>` | POST | Create resource |
| `useApiPostFile<V>` | POST | Upload file (multipart) |
| `useApiPut<R,V,D>` | PUT | Replace resource |
| `useApiPatch<R,V,D>` | PATCH | Partial update |
| `useApiDelete<V>` | DELETE | Remove resource |

### Theme System

| Theme | Description |
|-------|-------------|
| System | Follows OS `prefers-color-scheme` |
| Light | White background, dark text |
| Dark | Warm dark tones (rgb 23,18,17) |
| Dark Blue | Cool dark with blue primary |
| Light Red | Light with red accents |

## Technology Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | >=19.0.0 | UI library |
| React DOM | >=19.0.0 | DOM rendering |
| React Router | >=7.0.0 | Routing |
| React Bootstrap | >=2.10.1 | UI components |
| Bootstrap | 5.3.8 | CSS framework |
| TypeScript | 5.9.x | Type safety |

### Authentication & Data

| Package | Version | Purpose |
|---------|---------|---------|
| @azure/msal-browser | 5.0.2 | MSAL core |
| @azure/msal-react | >=2.2.0 | React integration |
| @tanstack/react-query | >=5.56.2 | Data fetching |
| axios | 1.13.x | HTTP client |

### Forms & UI

| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | >=7.54.1 | Form state |
| @fortawesome/* | >=6.6.0 | Icons |
| react-toastify | 11.x | Toast notifications |
| react-error-boundary | 6.x | Error handling |
| classnames | 2.x | CSS class merging |
| date-fns | 4.x | Date utilities |

### Build Tools

| Tool | Purpose |
|------|---------|
| Rollup | Library bundling |
| Vite | Demo app dev server |
| ESLint | Linting |
| Storybook | Documentation |

## Security & Configuration

### Authentication

- **Provider:** Azure AD via MSAL
- **Flow:** Redirect-based (not popup)
- **Token Storage:** Session storage
- **Token Refresh:** Automatic silent refresh with fallback to redirect
- **Scopes:** Configurable per application

### Configuration

| Setting | Location | Purpose |
|---------|----------|---------|
| `clientId` | MooApp prop | Azure AD app registration |
| `scopes` | MooApp prop | API permission scopes |
| `baseUrl` | MooApp prop | API base URL |

### Security Scope

**In Scope:**
- ✅ Secure token acquisition and refresh
- ✅ Authorization header injection
- ✅ Session storage for tokens (not localStorage)
- ✅ HTTPS-only redirects

**Out of Scope:**
- ❌ Role-based access control (RBAC) UI components
- ❌ Row-level security
- ❌ Audit logging

## Success Criteria

### Functional Requirements

- ✅ Applications can authenticate users via Azure AD
- ✅ API calls include valid Bearer tokens automatically
- ✅ Forms validate and submit data correctly
- ✅ Tables paginate and sort properly
- ✅ Layouts adapt to mobile viewports
- ✅ Themes persist across sessions
- ✅ Errors are caught and displayed gracefully

### Quality Indicators

- TypeScript strict mode compatibility
- No runtime console errors in production builds
- Accessible components (ARIA attributes, semantic HTML)
- Consistent styling across themes
- Reasonable bundle size (<200KB gzipped for core libraries)

### Developer Experience Goals

- Minimal boilerplate to start a new application
- Comprehensive TypeScript types and IntelliSense
- Clear component APIs with sensible defaults
- Documentation via Storybook

## Implementation Phases

### Phase 1: Foundation (Complete)

**Goal:** Establish core design system and application framework

**Deliverables:**
- ✅ moo-ds component library with forms, layout, tables
- ✅ moo-app framework with MSAL and API hooks
- ✅ moo-icons SVG icon library
- ✅ Theme system with CSS variables
- ✅ npm workspaces monorepo setup

**Validation:** Demo app (demoo) successfully demonstrates all features

### Phase 2: Documentation (In Progress)

**Goal:** Provide comprehensive documentation for adoption

**Deliverables:**
- ✅ Storybook setup
- ⬜ Component stories with controls
- ⬜ Usage examples for common patterns
- ⬜ API documentation

**Validation:** New developers can build an app from documentation alone

### Phase 3: Testing

**Goal:** Ensure reliability through automated testing

**Deliverables:**
- ⬜ Unit tests for utility functions
- ⬜ Component tests with Testing Library
- ⬜ Integration tests for auth flow
- ⬜ Visual regression tests

**Validation:** >80% code coverage, CI pipeline passes

### Phase 4: Ecosystem

**Goal:** Improve developer experience and adoption

**Deliverables:**
- ⬜ CLI tool for project scaffolding
- ⬜ VS Code snippets
- ⬜ Example applications
- ⬜ Migration guides for version upgrades

**Validation:** Time to first app reduced to <15 minutes

## Future Considerations

### Dependency Removal

- **Bootstrap** - Remove Boostrap and React Bootstrap as a dependency

### Post-MVP Enhancements

- **Data Grid:** Advanced table with inline editing, column resizing, virtualization, based on Tanstack Table

### Integration Opportunities

- **Alternative Auth:** Support for Auth0, Okta, AWS Cognito

### Advanced Features

- **Offline:** Service worker and offline-first patterns
- **Analytics:** Built-in telemetry hooks

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| React 19 breaking changes | High | Low | Pin React version, test upgrades in isolation |
| MSAL library changes | Medium | Medium | Abstract MSAL behind internal interface |
| Bootstrap major version | Medium | Low | Use CSS variables, minimize direct Bootstrap class usage |
| Bundle size growth | Medium | Medium | Tree-shaking, code splitting, regular size audits |
| Accessibility gaps | High | Medium | Regular a11y audits, use semantic HTML, test with screen readers |

## Appendix

### Repository Structure

```
MooApp/
├── moo-ds/           # Design system package
├── moo-app/          # Application framework package
├── moo-icons/        # Icon library package
├── demoo/            # Demo application
├── storybook/        # Documentation site
├── package.json      # Workspaces root
└── CLAUDE.md         # AI assistant guidance
```

### Related Resources

- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [React Query Documentation](https://tanstack.com/query)
- [React Hook Form Documentation](https://react-hook-form.com/)

### Package Registry

Published to GitHub Packages under `@andrewmclachlan` scope:
- `@andrewmclachlan/moo-ds`
- `@andrewmclachlan/moo-app`
- `@andrewmclachlan/moo-icons`
