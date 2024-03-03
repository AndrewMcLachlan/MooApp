import { PropsWithChildren } from "react";
import { Table, TableProps } from "react-bootstrap"
import { Section } from "./Section";

export const SectionTable: React.FC<PropsWithChildren<SectionTableProps>> = ({title, titleSize, ...rest}) => (
    <Section className="table" title={title} size={titleSize}>
        <Table {...rest} />
    </Section>
);

export interface SectionTableProps extends TableProps {
    title?: string;
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
}
