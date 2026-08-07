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
            {/* ?? not ||: only an absent prop falls back to the spinner. A widget
                that has been given a placeholder must never substitute one, or the
                loading style silently changes with state the caller wasn't thinking
                about — the point of a skeleton is to replace the spinner, not to
                replace it sometimes. */}
            {loading && (loadingPlaceholder ?? <SpinnerContainer />)}
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
     * What to show while `loading`. Omit it (or pass `null`/`undefined`) for a centred `SpinnerContainer`.
     *
     * Supply one where a spinner would throw away shape you already know —
     * `loadingPlaceholder={<Skeleton.Chart variant="bar" />}` for a chart.
     *
     * Once supplied it is always used: a value that evaluates to `false` renders
     * nothing rather than reverting to the spinner, so the loading style cannot
     * change underneath you. Only `undefined`/`null` (including omitting the prop) gives the spinner.
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
