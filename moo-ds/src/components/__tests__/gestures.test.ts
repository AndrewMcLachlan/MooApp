import { describe, it, expect } from "vitest";
import { AXIS_LOCK_THRESHOLD, lockAxis, OPEN_RATIO, shouldOpen, swipeOffset } from "../swipeGestures";
import { canPull, isArmed, isVertical, pullDistance, PULL_MAX, PULL_THRESHOLD } from "../pullGestures";

describe("lockAxis", () => {
    it("stays undecided until a gesture commits", () => {
        expect(lockAxis(2, 3)).toBe("undecided");
        expect(lockAxis(AXIS_LOCK_THRESHOLD - 1, 0)).toBe("undecided");
    });

    it("claims a gesture that leads horizontally", () => {
        expect(lockAxis(-20, 4)).toBe("horizontal");
    });

    it("surrenders a gesture that leads vertically", () => {
        // A list being scrolled with a slight sideways drift still scrolls.
        expect(lockAxis(-6, 30)).toBe("vertical");
    });

    it("does not flip axis once the threshold is passed in one direction", () => {
        expect(lockAxis(-AXIS_LOCK_THRESHOLD, AXIS_LOCK_THRESHOLD - 1)).toBe("horizontal");
    });
});

describe("swipeOffset", () => {
    it("ignores a rightward drag on a closed row", () => {
        expect(swipeOffset(40, 144)).toBe(0);
    });

    it("follows a leftward drag", () => {
        expect(swipeOffset(-50, 144)).toBe(-50);
    });

    it("stops at the width of the action panel", () => {
        expect(swipeOffset(-500, 144)).toBe(-144);
    });
});

describe("shouldOpen", () => {
    it("opens past the ratio and closes short of it", () => {
        const width = 144;
        expect(shouldOpen(-width * OPEN_RATIO, width)).toBe(true);
        expect(shouldOpen(-width * OPEN_RATIO + 1, width)).toBe(false);
    });

    it("cannot open a row with no actions to reveal", () => {
        expect(shouldOpen(-100, 0)).toBe(false);
    });
});

describe("pullDistance", () => {
    it("ignores an upward pull", () => {
        expect(pullDistance(-40)).toBe(0);
    });

    it("moves at half the finger's travel before the threshold", () => {
        expect(pullDistance(40)).toBe(20);
    });

    it("keeps moving past the threshold, but grudgingly", () => {
        const atThreshold = pullDistance(PULL_THRESHOLD);
        const beyond = pullDistance(PULL_THRESHOLD * 2);

        expect(beyond).toBeGreaterThan(atThreshold);
        expect(beyond - atThreshold).toBeLessThan(PULL_THRESHOLD);
    });

    it("never travels further than the maximum", () => {
        expect(pullDistance(10_000)).toBe(PULL_MAX);
    });
});

describe("arming the refresh", () => {
    it("arms once the content has moved half the threshold", () => {
        expect(isArmed(pullDistance(PULL_THRESHOLD))).toBe(true);
        expect(isArmed(pullDistance(10))).toBe(false);
    });

    it("only pulls from the top of the scroller", () => {
        expect(canPull(0)).toBe(true);
        expect(canPull(1)).toBe(false);
    });

    it("leaves a sideways gesture to whatever handles swipes", () => {
        expect(isVertical(30, 5)).toBe(false);
        expect(isVertical(5, 30)).toBe(true);
    });
});
