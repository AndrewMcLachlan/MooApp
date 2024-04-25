import { PropsWithChildren } from "react";
import { Table, TableProps } from "react-bootstrap"
import { Section } from "./Section/Section";
import classNames from "classnames";

export const SectionTable: React.FC<PropsWithChildren<SectionTableProps & React.RefAttributes<HTMLTableElement>>> = ({ title, titleSize, className, ...rest }) => (
    <>
        {title &&
            <Section className="table" title={title} titleSize={titleSize}>
                <Table className={className} {...rest} />
            </Section>
        }
        {!title &&
            <Table className={classNames("section", className)} {...rest} />
        }
    </>
);

export interface SectionTableProps extends TableProps {
    title?: string;
    titleSize?: 1 | 2 | 3 | 4 | 5 | 6;
}
