# Code Review: MSAL Auth Fixes

**Branch:** `feature/msal-fixes` (commit `25832f8`)
**Date:** 2026-02-14

## Stats

- Files Modified: 3
- Files Added: 0
- Files Deleted: 0
- New lines: 39
- Deleted lines: 2

## Changed Files

| File | Change |
|---|---|
| `moo-app/src/login/Login.tsx` | Gate child rendering on `useIsAuthenticated()` |
| `moo-app/src/login/__tests__/Login.test.tsx` | Updated tests for auth gate + 2 new test cases |
| `moo-app/src/providers/HttpClientProvider.tsx` | Added `no_account_error` to `shouldRedirect` list |

## Issues

```
severity: medium
file: moo-app/src/providers/__tests__/HttpClientProvider.test.tsx
line: 149-167
issue: No test coverage for no_account_error interceptor behavior
detail: The addMsalInterceptor test suite only verifies that an interceptor is added.
  There is no test exercising the new no_account_error path to confirm it triggers
  shouldRedirect=true, cancels the request, and (when inProgress is None) calls
  acquireTokenRedirect. This is the core bug fix and should be validated by tests.
suggestion: Add test cases for the interceptor error handling:
  1. acquireTokenSilent rejects with errorCode "no_account_error" and inProgress=None
     -> verify acquireTokenRedirect is called and CanceledError is thrown
  2. acquireTokenSilent rejects with errorCode "no_account_error" and inProgress=Startup
     -> verify acquireTokenRedirect is NOT called but CanceledError is still thrown
```

```
severity: low
file: moo-app/src/login/Login.tsx
line: 11
issue: Login renders null during auth initialization with no loading indicator
detail: During MsalProvider's Startup phase (while handleRedirectPromise resolves),
  useIsAuthenticated() returns false and Login renders null. For apps with cached
  sessions doing F5, this creates a brief blank flash before the cached accounts
  load and children render. MooApp already returns null during MSAL init (line 59),
  so the total blank period spans both async initializations. This is functionally
  correct but may be worth noting for consuming apps expecting a loading state.
suggestion: Consider accepting an optional fallback/loading prop on MooApp or Login
  for apps that want a loading indicator during auth initialization. Not blocking.
```

## Verified Correct

- **Login.tsx hooks ordering:** `useMsalAuthentication` is called before the early return, satisfying React's rules of hooks. The redirect flow is always initiated regardless of `isAuthenticated` state.

- **no_account_error classification:** MSAL Browser v5's `StandardController.acquireTokenSilent()` (line 1063-1064) throws `createBrowserAuthError(noAccountError)` when no account exists. This is a `BrowserAuthError`, not `InteractionRequiredAuthError`, which is why it previously fell through to the `else` branch and allowed unauthenticated requests. Adding it to `shouldRedirect` is correct.

- **Defense in depth:** With the Login gate, API requests should never fire when there's no account (Login returns null, RouterProvider doesn't render, no query hooks fire). The interceptor fix acts as a safety net for edge cases (e.g., account removed from cache while the app is running).

- **Login test coverage:** New tests cover both the authenticated rendering path (existing tests updated) and the unauthenticated gate (2 new tests: "does not render children when not authenticated" and "calls useMsalAuthentication even when not authenticated"). Test count increased from 9 to 11.

- **No regressions:** All 306 tests pass (32 test files).

## Pre-existing Observations (Not Introduced by This Change)

- **HttpClientProvider line 71:** The `msal` dependency (from `useMsal()`) is a new object reference whenever `inProgress` or `accounts` changes, causing the interceptor effect to eject and re-register on every MSAL state transition. Functionally correct but causes unnecessary churn during initialization. Would be cleaner to depend on `msal.instance` (stable) and read `inProgress` from a ref inside the interceptor.

- **demoo App.tsx line 12-14:** The `useIsAuthenticated()` guard in the demoo App component is now redundant with the Login component's gate. Not harmful (double-check is fine) but could be simplified.
