import { Section } from "../layout/Section/Section";
import { PropsWithChildren } from "react";
import { Col } from "react-bootstrap";
import { SpinnerContainer } from "./SpinnerContainer";

export const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({ children, loading = false, ...rest }) => (
    <Col xl={4} lg={6} md={12}>
        <Section {...rest}>
            {loading && <SpinnerContainer />}
            {!loading && children}
        </Section>
    </Col>
)

export interface WidgetProps {
    loading?: boolean;
    title?: string;
    size?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
}
