import { PropsWithChildren } from "react";
import { Table, TableProps } from "react-bootstrap"
import { Section, SectionProps } from "./Section/Section";
import classNames from "classnames";

export const SectionTable: React.FC<PropsWithChildren<SectionTableProps & React.RefAttributes<HTMLTableElement>>> = ({ header, headerSize, className, ...rest }) => (
    <>
        {header &&
            <Section className="table" header={header} headerSize={headerSize}>
                <Table className={className} {...rest} />
            </Section>
        }
        {!header &&
            <Table className={classNames("section", className)} {...rest} />
        }
    </>
);

export interface SectionTableProps extends TableProps, Pick<SectionProps, "header" | "headerSize"> {
}
