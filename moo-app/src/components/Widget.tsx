import { Section } from "../layout/Section/Section";
import { PropsWithChildren } from "react";
import { Col } from "react-bootstrap";
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
    title?: string;
    size: "single" | "double";
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
}
