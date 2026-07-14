# Release Branching & Versioning

How the MooApp packages (`moo-ds`, `moo-app`, `moo-icons`) are versioned and published.
**The version is *stated*, never inferred** — no GitVersion, no tags, no version-bump ceremony.

## The version

The current `Major.Minor` is declared in the **root `package.json`** `version` field:

```jsonc
{
  "version": "5.2.0"
  // for a prerelease line, state a suffix instead:
  // "version": "6.0.0-beta"
}
```

The stated patch is ignored — CI (`.github/workflows/build.yml`, via
[`AndrewMcLachlan/Actions/get-node-version`](https://github.com/AndrewMcLachlan/Actions)) turns the
stated version into the published version:

- **Patch = commits since the version line last changed.** Specifically
  `git rev-list --count "$(git log -1 --format=%H -G'"version":' -- package.json)"..HEAD`.
  The `-G'"version":'` scopes the counter to commits that actually changed the `"version"` line, so
  **editing `package.json` for any other reason (adding a dependency, a script) does not reset the
  patch**.
- Stable → `Major.Minor.<count>` (e.g. `5.2.17`). Prerelease → `Major.Minor.0-<suffix>.<count>`
  (e.g. `6.0.0-beta.4`).

**Monorepo:** the root `package.json` is the single source of truth. CI applies the computed version
to every published workspace before building and publishing:

```
npm pkg set version=<computed> --workspace=moo-ds --workspace=moo-app --workspace=moo-icons
```

The committed workspace `version` fields are just placeholders (kept in sync with the root for
tidiness); the published value is always the computed one.

**To bump the minor or major:** edit the root `version` (`5.2` → `5.3` / `6.0`) and commit. That
commit resets the patch, so the next publish is `X.Y.0`. That single, reviewable edit *is* the
deliberate version decision — nothing else to do. (Remember to keep the workspace `version` fields
and `package-lock.json` in sync, e.g. `npm pkg set version=X.Y.0` for the root + workspaces, then
`npm install --package-lock-only`.)

## Branching

Because the version lives in `package.json` *on the branch*, every branch is self-describing and
isolated — no shared tags, no cross-talk.

- **`main` is the trunk.** PRs and Dependabot land here; every merge publishes `X.Y.<count>` (stable).
- **`feature/*` / PRs** build and test but never publish.
- **A preview line is a `release/**` branch whose stated version carries a suffix** — e.g. branch
  `release/6.0-beta`, set `"version": "6.0.0-beta"` → publishes `6.0.0-beta.N` when the build workflow
  is run (via `workflow_dispatch`, or by expanding the workflow `on.push.branches` to include `release/**`), while `main` stays on
  `5.x`.

**Publishing is gated in CI to `main` (the stable trunk) and prerelease builds** — i.e. `main`, or
any branch whose stated version carries a suffix (`is-prerelease`). A `release/**` branch with no
suffix publishes nothing (that's what lets you graduate a beta in place — see below).

## Graduating a preview to GA

Because a suffix-less `release/**` branch publishes nothing, you graduate **in place** — no
promotion or integration branch:

1. On `release/6.0-beta`, remove the `-beta` suffix (`"version": "6.0.0"`) and commit. The build runs
   but **publishes nothing** (stable, but not `main`).
2. Merge `release/6.0-beta` → `main`. `main` publishes **`6.0.0`** (removing the suffix reset the patch).
3. Delete `release/6.0-beta`.

## Cutting a new major/minor

- **Minor / non-breaking:** edit the root `version` on `main` (`5.2` → `5.3`) in a normal PR; the next
  merge publishes `5.3.0`.
- **Breaking major (previewed):** branch `release/6.0-beta`, set `"version": "6.0.0-beta"`, then
  graduate as above.
