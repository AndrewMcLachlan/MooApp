import { isAuthCancellation } from "../providers";

/**
 * Whether auth recovery should re-run a query: it failed, and it failed because the
 * auth window cancelled it rather than for a reason of its own.
 *
 * Matching on "failed" alone is not enough. Recovery fires on routine silent token
 * renewals, and every refetch acquires a token, so a query left failing for an
 * unrelated reason — a 5xx while the API is down — would be invalidated, refetch,
 * trigger another silent success, and be invalidated again, looping for as long as
 * the API stayed down. Testing the error keeps recovery doing its job while leaving
 * unrelated failures to surface as errors.
 *
 * Internal: this module is deliberately not re-exported from `src/index.ts`, so the
 * predicate stays out of the package's public API.
 */
export const brokenByAuthWindow = (query: { state: { status: string; error: unknown } }): boolean =>
    query.state.status === "error" && isAuthCancellation(query.state.error);
