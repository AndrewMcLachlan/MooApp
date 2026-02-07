# MSAL Review Plan (Adjusted for UX + Single Account)

## Goals
- Maintain smooth UX without frequent redirect/popup interruptions when tokens expire.
- Keep single-account assumptions while reducing risk of redirect loops and auth failures.

## Context Summary (Adjusted Findings)
- The implementation delivers auto-login via redirect on page load and uses an Axios interceptor to attach bearer tokens.
- Main UX risk is not token expiry itself, but redirect triggers on token acquisition failures that should be handled silently first and only fall back to interactive when strictly required.
- Multi-account handling can be deferred, but active account should still be used when available to avoid ambiguous token acquisition if future changes add more accounts.

## Best‑Practice Alignment Plan
1. Document the intended auth UX and clarify when an interactive redirect is acceptable (first login, explicit sign-in, or interaction-required errors only).
2. Review the interceptor flow to ensure:
   - Silent token acquisition is attempted first and only once per request.
   - Interactive auth is only triggered for `InteractionRequiredAuthError` (or equivalent error codes).
   - No additional redirect is attempted inside request flow after calling `loginRedirect`/`acquireTokenRedirect`.
3. Ensure access tokens are only attached when present; avoid setting an `Authorization` header on failure.
4. Ensure interceptor is registered once per client lifecycle to avoid duplicate token acquisition.
5. Confirm login scopes vs API scopes strategy:
   - If user consent on first login is desired, include API scopes in the initial request.
   - If deferring consent is desired, ensure interactive fallback is limited and predictable.

## Deliverables
- A short, updated best‑practice report focused on UX stability and minimal interactive auth prompts.
- A list of concrete code touch points (no changes made) where the above behavior is currently at risk.

## Out of Scope
- Multi‑account support beyond selecting the active account if present.
- Changes to routing, UI flows, or MSAL configuration beyond what’s needed for stable token acquisition.
