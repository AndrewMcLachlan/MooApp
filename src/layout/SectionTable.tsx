import { PropsWithChildren } from "react";
import { Table, TableProps } from "react-bootstrap"
import { Section } from "./Section";

export const SectionTable: React.FC<PropsWithChildren<SectionTableProps>> = ({ title, titleSize, ...rest }) => (
    <>
        {title &&
            <Section className="table" title={title} size={titleSize}>
                <Table {...rest} />
            </Section>
        }
        {!title &&
            <Table className="section" {...rest} />
        }
    </>
);

export interface SectionTableProps extends TableProps {
    title?: string;
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
}
