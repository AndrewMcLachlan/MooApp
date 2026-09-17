/**
 * Gesture arithmetic for PullToRefresh, kept apart from the component so the
 * thresholds can be tested without a touch screen.
 */

/** How far the content moves at the point the gesture arms. */
export const PULL_THRESHOLD = 64;

/** The furthest the content travels, however hard the pull. */
export const PULL_MAX = 96;

/**
 * Distance the content should move for a raw finger travel.
 *
 * Damped, and increasingly so past the threshold: a pull that keeps moving
 * with the finger reads as a scroll that has come loose, and one that stops
 * dead reads as broken.
 */
export const pullDistance = (rawDelta: number): number => {
    if (rawDelta <= 0) return 0;
    if (rawDelta <= PULL_THRESHOLD) return rawDelta * 0.5;

    const beyond = rawDelta - PULL_THRESHOLD;
    const damped = PULL_THRESHOLD * 0.5 + beyond * 0.2;
    return Math.min(damped, PULL_MAX);
};

/** Whether releasing at this distance should refresh. */
export const isArmed = (distance: number): boolean => distance >= PULL_THRESHOLD * 0.5;

/**
 * Whether a gesture starting here is a pull rather than a scroll.
 *
 * A pull only exists at the very top of the scroller; anywhere else the finger
 * belongs to the scroll it started.
 */
export const canPull = (scrollTop: number): boolean => scrollTop <= 0;

/**
 * Whether a movement is vertical enough to treat as a pull.
 *
 * A gesture that is mostly sideways belongs to whatever handles horizontal
 * swipes, and claiming it would break them.
 */
export const isVertical = (deltaX: number, deltaY: number): boolean =>
    Math.abs(deltaY) > Math.abs(deltaX);
