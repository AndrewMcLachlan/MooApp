import classNames from "classnames";
import React from "react";

export type SkeletonChartVariant = "bar" | "horizontal-bar" | "line" | "pie" | "doughnut";

export interface SkeletonChartProps extends React.HTMLAttributes<HTMLElement> {
    /** Shape to stand in for. Defaults to "bar". */
    variant?: SkeletonChartVariant;
    /** Bars, series lines, or slices. Defaults to 6 — 2 for "line". */
    count?: number;
}

// Six bars is sensible; six overlaid lines is a mess. Hence per-variant defaults.
const DEFAULT_COUNT: Record<SkeletonChartVariant, number> = {
    "bar": 6,
    "horizontal-bar": 6,
    "line": 2,
    "pie": 6,
    "doughnut": 6,
};

// Slice angle has to reach CSS somehow. Inline `style` is out (project rules), so
// the count becomes a class and the CSS holds one rule per value in this range.
const MIN_SLICES = 2;
const MAX_SLICES = 12;

const isRound = (variant: SkeletonChartVariant) => variant === "pie" || variant === "doughnut";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * A shimmering stand-in for a chart that has no data yet. Chart.js paints nothing
 * until data arrives, so this owns the whole visual for the wait.
 *
 * It draws only what is invariant for a given shape — the elements, plus a baseline
 * axis where one always exists. Legends and tick labels are deliberately absent: they
 * cannot be guessed from outside the consumer's chart config, and furniture that turns
 * out wrong is worse than none.
 */
export const SkeletonChart: React.FC<SkeletonChartProps> = ({ variant = "bar", count, className, ...rest }) => {

    // ?? only catches null/undefined, so a non-finite number would flow straight
    // through: Infinity blows up Array.from with a RangeError, and NaN emits a
    // junk skeleton-chart-count-NaN class. Fall back to the default for both.
    const requested = count ?? DEFAULT_COUNT[variant];
    const resolved = Number.isFinite(requested) ? requested : DEFAULT_COUNT[variant];

    // Pie and doughnut are a single masked disc, not a set of children.
    if (isRound(variant)) {
        const slices = clamp(Math.round(resolved), MIN_SLICES, MAX_SLICES);

        return (
            <span
                className={classNames(
                    "skeleton",
                    "skeleton-chart",
                    `skeleton-chart-${variant}`,
                    `skeleton-chart-count-${slices}`,
                    className,
                )}
                aria-hidden="true"
                {...rest}
            />
        );
    }

    const elements = Math.max(0, Math.round(resolved));

    return (
        <span
            className={classNames("skeleton-chart", `skeleton-chart-${variant}`, className)}
            aria-hidden="true"
            {...rest}
        >
            {Array.from({ length: elements }).map((_, index) => (
                <span key={index} className="skeleton skeleton-chart-element" />
            ))}
        </span>
    );
};

SkeletonChart.displayName = "Skeleton.Chart";
