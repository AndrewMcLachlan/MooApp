import React, { PropsWithChildren } from "react";
import { Row, RowProps } from "react-bootstrap";

export const SectionRow: React.FC<PropsWithChildren<SectionRowProps>> = ({children}) => (
    <Row className="section-row">
        {children}
    </Row>
);

export interface SectionRowProps extends RowProps {
}