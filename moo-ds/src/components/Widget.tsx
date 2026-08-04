import classNames from "classnames";
import { Section } from "../layout/Section/Section";
import { type PropsWithChildren } from "react";
import { SpinnerContainer } from "./SpinnerContainer";
import { ProgressIndeterminate } from "./ProgressIndeterminate";

// `is-refreshing` goes on the Section rather than on a wrapper around the
// children: a wrapper would swallow `.section .body { flex: 1 }` and the
// dashboard's `.section > *` flex rules. The CSS dims the children instead.
export const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({ children, loading = false, refreshing = false, size = "single", className, ...rest }) => (
    <div className={size}>
        <Section className={classNames(className, !loading && refreshing && "is-refreshing")} {...rest}>
            {loading && <SpinnerContainer />}
            {!loading && refreshing && <ProgressIndeterminate variant="edge" />}
            {!loading && children}
        </Section>
    </div>
)

Widget.displayName = "Widget";

export interface WidgetProps {
    /** No data yet: the body is replaced by a centred spinner. Wins over `refreshing`. */
    loading?: boolean;
    /** Data is on screen and being refetched: edge bar + dimmed body, body stays mounted. */
    refreshing?: boolean;
    header?: string | React.ReactNode;
    size: "single" | "double";
    headerSize?: 1 | 2 | 3 | 4 | 5 | 6;
    to?: string;
    className?: string;
}
