import { Section } from "../layout/Section/Section";
import { PropsWithChildren } from "react";
import { SpinnerContainer } from "./SpinnerContainer";

export const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({ children, loading = false, size = "single", ...rest }) => (
    <div className={size}>
        <Section {...rest}>
            {loading && <SpinnerContainer />}
            {!loading && children}
        </Section>
    </div>
)

Widget.displayName = "Widget";

export interface WidgetProps {
    loading?: boolean;
    header?: string | React.ReactNode;
    size: "single" | "double";
    headerSize?: 1 | 2 | 3 | 4 | 5 | 6;
    to?: string;
    className?: string;
}
