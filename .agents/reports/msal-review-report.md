# MSAL UX Stability Review

Date: 2026-02-07
Plan: `.agents/plans/msal-review-plan.md`

## Intended Auth UX (clarified)
- Interactive redirect is acceptable only for first sign-in, explicit sign-in, or interaction-required token errors.
- Normal API calls should attempt silent token acquisition first and avoid redirect loops.
- If token acquisition fails for a request, do not attach `Authorization` and allow the request/error flow to continue predictably.

## Current Risk Touch Points
1. Global redirect on any `ACQUIRE_TOKEN_FAILURE` event can cause redirect loops and non-deterministic UX.
- `moo-app/src/login/msal.ts:71`
- `moo-app/src/login/msal.ts:72`

2. Request interceptor calls `loginRedirect` and then immediately retries `acquireTokenSilent` in the same request flow.
- `moo-app/src/providers/HttpClientProvider.tsx:69`
- `moo-app/src/providers/HttpClientProvider.tsx:70`

3. `Authorization` header is always set even when token acquisition failed (`token` can be null/undefined).
- `moo-app/src/providers/HttpClientProvider.tsx:76`

4. Interceptor registration runs from component body and helper hooks, so duplicate interceptors can accumulate during re-renders.
- `moo-app/src/providers/HttpClientProvider.tsx:26`
- `moo-app/src/providers/HttpClientProvider.tsx:49`
- `moo-app/src/services/msgraph.ts:12`

5. `usePhoto` creates a new client/interceptor each render and uses `useMemo` for side effects (`GET`), increasing repeated token flows.
- `moo-app/src/services/msgraph.ts:11`
- `moo-app/src/services/msgraph.ts:12`
- `moo-app/src/services/msgraph.ts:14`

6. Active-account usage is mixed; some code reads from `accounts[0]` instead of active account, which is fragile if account assumptions change.
- `moo-app/src/components/Avatar.tsx:12`
- `moo-app/src/login/msal.ts:79`

7. Login scopes currently request only `openid profile`; API consent behavior should be intentional and documented (upfront vs deferred).
- `moo-app/src/login/msal.ts:42`
- `moo-app/src/providers/HttpClientProvider.tsx:56`
- `moo-app/src/login/Login.tsx:8`

## Best-Practice Alignment Actions
1. Remove broad redirect behavior from global event callback; do not redirect on every `ACQUIRE_TOKEN_FAILURE`.
2. In request interceptor:
- Try `acquireTokenSilent` once.
- Trigger interactive auth only for `InteractionRequiredAuthError` (or explicit equivalent), then exit request flow without additional silent retry in that same cycle.
- Do not set `Authorization` if no access token is available.
3. Register interceptors once per client lifecycle (e.g., effect with cleanup/eject, or a per-client guard).
4. Ensure all token requests include the intended account (`getActiveAccount()` when present) to preserve single-account behavior safely.
5. Decide and document scope strategy:
- Upfront consent: include API scopes in login request.
- Deferred consent: keep login scopes minimal and constrain interactive fallback to interaction-required cases only.

## Notes
- This review intentionally follows plan scope: single-account assumptions retained, no routing/UI redesign, no code changes in this deliverable.
