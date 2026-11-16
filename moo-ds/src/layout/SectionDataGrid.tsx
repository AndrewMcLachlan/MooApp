import React from "react";
import { DataGrid, type DataGridProps } from "../components/dataGrid/DataGrid";
import { Section, type SectionProps } from "./Section/Section";
import classNames from "classnames";

export interface SectionDataGridProps<TData> extends DataGridProps<TData>, Pick<SectionProps, "header" | "headerSize" | "accent"> {
}

function SectionDataGridInner<TData>(
    { header, headerSize, accent, className, ...rest }: SectionDataGridProps<TData>,
    ref: React.ForwardedRef<HTMLTableElement>,
) {
    if (header || accent) {
        return (
            <Section className="section-table" header={header} headerSize={headerSize} accent={accent}>
                <DataGrid ref={ref} className={className} {...rest} />
            </Section>
        );
    }

    return (
        <DataGrid ref={ref} className={classNames("section", className)} {...rest} />
    );
}

export const SectionDataGrid = React.forwardRef(SectionDataGridInner) as <TData>(
    props: SectionDataGridProps<TData> & React.RefAttributes<HTMLTableElement>,
) => React.ReactElement | null;

(SectionDataGrid as any).displayName = "SectionDataGrid";
