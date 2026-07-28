import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { brokenByAuthWindow } from "../login/authRecovery";

/** The marker the auth interceptors stamp on cancellations they raise. */
const authCancellationMarker = Symbol.for("mooapp.authCancellation");

const authCancellation = () =>
  Object.assign(new axios.CanceledError("token refresh"), { [authCancellationMarker]: true });

const query = (status: string, error: unknown) => ({ state: { status, error } });

describe('brokenByAuthWindow', () => {

  it('matches a query cancelled by the auth interceptor', () => {
    // The case recovery exists for: the request was dropped mid auth window, so once a
    // token lands the query has to be re-run or it stays failed forever.
    expect(brokenByAuthWindow(query('error', authCancellation()))).toBe(true);
  });

  it('ignores a query that failed for a reason of its own', () => {
    // A 5xx while the API is down. Re-running it would fail again, acquire another
    // token, and fire recovery again — the loop this predicate exists to stop.
    expect(brokenByAuthWindow(query('error', Object.assign(new Error('Bad Gateway'), { status: 502 })))).toBe(false);
  });

  it('ignores a cancellation the auth interceptors did not raise', () => {
    // An ordinary abort — a component unmounting, a superseded request — is not an
    // auth failure and has nothing to recover.
    expect(brokenByAuthWindow(query('error', new axios.CanceledError('unmounted')))).toBe(false);
  });

  it('ignores queries that have not failed', () => {
    expect(brokenByAuthWindow(query('success', undefined))).toBe(false);
    expect(brokenByAuthWindow(query('pending', undefined))).toBe(false);
  });

  it('ignores a failed query with no error attached', () => {
    expect(brokenByAuthWindow(query('error', undefined))).toBe(false);
    expect(brokenByAuthWindow(query('error', null))).toBe(false);
  });
});
