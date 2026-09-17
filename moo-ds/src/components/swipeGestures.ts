/**
 * Gesture arithmetic for SwipeRow, kept apart from the component so the axis
 * locking and thresholds can be tested without a touch screen.
 */

/** Movement before a gesture is claimed as a swipe or surrendered to the scroller. */
export const AXIS_LOCK_THRESHOLD = 8;

/** Proportion of the action panel that must be revealed for a release to open it. */
export const OPEN_RATIO = 0.4;

export type Axis = "horizontal" | "vertical" | "undecided";

/**
 * Which axis a gesture belongs to.
 *
 * Undecided until one axis leads by the threshold: deciding on the first pixel
 * claims a vertical scroll that happened to start with a wobble.
 */
export const lockAxis = (deltaX: number, deltaY: number): Axis => {
    const x = Math.abs(deltaX);
    const y = Math.abs(deltaY);

    if (Math.max(x, y) < AXIS_LOCK_THRESHOLD) return "undecided";
    return x > y ? "horizontal" : "vertical";
};

/**
 * How far the row should sit from its resting position.
 *
 * Only leftward travel opens the panel, and never further than the panel is
 * wide: an over-travelled row leaves a gap with nothing in it.
 */
export const swipeOffset = (deltaX: number, panelWidth: number): number => {
    if (deltaX >= 0) return 0;
    return Math.max(deltaX, -panelWidth);
};

/** Whether releasing at this offset should leave the panel open. */
export const shouldOpen = (offset: number, panelWidth: number): boolean => {
    if (panelWidth <= 0) return false;
    return Math.abs(offset) >= panelWidth * OPEN_RATIO;
};
