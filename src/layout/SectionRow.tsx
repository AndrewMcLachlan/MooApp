import React, { PropsWithChildren } from "react";
import { Row, RowProps } from "react-bootstrap";

export type SectionRowComponent = React.FC<PropsWithChildren<SectionRowProps>>;

export const SectionRow: React.FC<PropsWithChildren<SectionRowProps>> = ({children}) => (
    <Row className="section-row">
        {children}
    </Row>
);

export interface SectionRowProps extends RowProps {
}
