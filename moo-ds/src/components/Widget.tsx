import classNames from "classnames";
import { Section } from "../layout/Section/Section";
import { type PropsWithChildren } from "react";
import { SpinnerContainer } from "./SpinnerContainer";
import { ProgressIndeterminate } from "./ProgressIndeterminate";

// `is-refreshing` goes on the Section rather than on a wrapper around the
// children: a wrapper would swallow `.section .body { flex: 1 }` and the
// dashboard's `.section > *` flex rules. The CSS dims the children instead.
export const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({ children, loading = false, loadingPlaceholder, refreshing = false, size = "single", className, ...rest }) => (
    <div className={size}>
        {/* The region owns the loading announcement, not the placeholder — skeletons
            are aria-hidden by design, so without this a custom placeholder would be
            silent where the default spinner's role="status" was not. */}
        <Section
            className={classNames(className, !loading && refreshing && "is-refreshing")}
            aria-busy={loading || undefined}
            {...rest}
        >
            {/* Truthiness rather than a null check, so `cond && <Thing />` falling
                through to false still gets the default rather than nothing. */}
            {loading && (loadingPlaceholder || <SpinnerContainer />)}
            {/* "Refreshing", not the default "Loading": the data is already on
                screen, and announcing a load implies it is not. */}
            {!loading && refreshing && <ProgressIndeterminate variant="edge" aria-label="Refreshing" />}
            {!loading && children}
        </Section>
    </div>
);

Widget.displayName = "Widget";

export interface WidgetProps {
    /** No data yet — the body is replaced by `loadingPlaceholder`. Wins over `refreshing`. */
    loading?: boolean;
    /**
     * What to show while `loading`. Defaults to a centred `SpinnerContainer`.
     *
     * Supply one where a spinner would throw away shape you already know —
     * `loadingPlaceholder={<Skeleton.Chart variant="bar" />}` for a chart.
     */
    loadingPlaceholder?: React.ReactNode;
    /** Data is on screen and being refetched: edge bar + dimmed body, body stays mounted. */
    refreshing?: boolean;
    header?: string | React.ReactNode;
    size: "single" | "double";
    headerSize?: 1 | 2 | 3 | 4 | 5 | 6;
    to?: string;
    className?: string;
}
