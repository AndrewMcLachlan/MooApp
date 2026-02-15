import { Section } from "../layout/Section/Section";
import { PropsWithChildren } from "react";
import { Col } from "./Col";
import { SpinnerContainer } from "./SpinnerContainer";

export const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({ children, loading = false, size = "single", ...rest }) => (
    <Col xxl={4} xl={6} lg={12} className={size}>
        <Section {...rest}>
            {loading && <SpinnerContainer />}
            {!loading && children}
        </Section>
    </Col>
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
