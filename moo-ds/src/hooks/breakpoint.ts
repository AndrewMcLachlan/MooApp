import { useCallback, useSyncExternalStore } from "react";
import { breakpoints, type Breakpoint } from "../models/breakpoints";

const mediaQuery = (breakpoint: Breakpoint) => `(min-width: ${breakpoints[breakpoint]}px)`;

/**
 * Whether the viewport is at least as wide as a named breakpoint, tracking
 * changes.
 *
 * The server snapshot is `false`, so a render with no `window` behaves as the
 * narrowest case rather than throwing.
 */
export const useIsAtLeast = (breakpoint: Breakpoint): boolean => {

    const subscribe = useCallback((onChange: () => void) => {
        const list = window.matchMedia(mediaQuery(breakpoint));
        list.addEventListener("change", onChange);
        return () => list.removeEventListener("change", onChange);
    }, [breakpoint]);

    const getSnapshot = useCallback(() => window.matchMedia(mediaQuery(breakpoint)).matches, [breakpoint]);

    return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
