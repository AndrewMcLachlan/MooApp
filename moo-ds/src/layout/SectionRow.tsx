import React, { PropsWithChildren } from "react";
import { Row, RowProps } from "react-bootstrap";

export type SectionRowComponent = React.FC<PropsWithChildren<SectionRowProps>>;

export const SectionRow: React.FC<PropsWithChildren<SectionRowProps>> = ({children, ...props}) => (
    <Row className="section-row" {...props}>
        {children}
    </Row>
);

export interface SectionRowProps extends RowProps {
}
