# MooApp
An opinionated React library for scaffolding web applications.

![Build](https://github.com/andrewmclachlan/mooapp/actions/workflows/build.yml/badge.svg)

- Uses the MSAL library to handle authentication to Azure.
- Uses React Query and Axios for API calls
- Uses React Router for creating a SPA
- Provides an optional layout for a functional app
- Provides components to allow faster assembly of applications

## Avoiding `block_iframe_reload` on silent token renewal

MSAL renews tokens silently in a hidden iframe that navigates to the app's
redirect URI. By default that URI is the app itself, so the whole SPA re-boots
inside the iframe and MSAL aborts with `BrowserAuthError: block_iframe_reload`
(surfaced most visibly by the profile-photo fetch, but it affects every silent
renewal).

Following [MSAL's guidance](https://learn.microsoft.com/en-us/entra/msal/javascript/browser/errors#block_iframe_reload),
point silent renewals at a lightweight blank page that does not load MSAL:

1. Add `public/blank.html` to your app — it needs no scripts:

   ```html
   <!DOCTYPE html>
   <html>
     <head><title></title></head>
     <body></body>
   </html>
   ```

2. Register `<your-origin>/blank.html` as a redirect URI on the app's Azure AD
   registration (alongside your existing SPA redirect URI).

3. Pass it to `MooApp`:

   ```tsx
   <MooApp silentRedirectUri={`${window.location.origin}/blank.html`} ... />
   ```

This is used **only** for silent renewal — interactive login is unchanged and
still returns the user to the route they started from.
