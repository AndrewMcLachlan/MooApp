import { type PropsWithChildren } from "react";
import { Table, type TableProps } from "../components/Table";
import { Section, type SectionProps } from "./Section/Section";
import classNames from "classnames";

export const SectionTable: React.FC<PropsWithChildren<SectionTableProps & React.RefAttributes<HTMLTableElement>>> = ({ header, headerSize, className, ...rest }) => (
    <>
        {header &&
            <Section className="section-table" header={header} headerSize={headerSize}>
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
