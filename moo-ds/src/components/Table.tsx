import classNames from "classnames";
import React from "react";
import { LoadingTableRows } from "./LoadingTableRows";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    striped?: boolean;
    hover?: boolean;
    bordered?: boolean;
    borderless?: boolean;
    responsive?: boolean;
    /** When true, render skeleton rows in place of the table body. */
    loading?: boolean;
    /** Number of skeleton rows to show while loading. Defaults to 5. */
    loadingRows?: number;
    /**
     * Number of skeleton columns. Defaults to the column count inferred from the
     * `<thead>` row; supply this when there is no header to infer from.
     */
    loadingCols?: number;
}

// Count the columns in the first header row so skeleton rows match the real
// layout without the consumer having to state it. Only real header cells count,
// and each contributes its colSpan (default 1).
const inferColumnCount = (children: React.ReactNode): number => {
    let count = 0;
    React.Children.forEach(children, (child) => {
        if (count || !React.isValidElement(child) || child.type !== "thead") return;
        React.Children.forEach((child.props as { children?: React.ReactNode }).children, (row) => {
            if (count || !React.isValidElement(row) || row.type !== "tr") return;
            React.Children.forEach((row.props as { children?: React.ReactNode }).children, (cell) => {
                if (!React.isValidElement(cell)) return;
                const span = (cell.props as { colSpan?: number }).colSpan;
                count += typeof span === "number" && span > 0 ? span : 1;
            });
        });
    });
    return count;
};

// While loading, keep the table's structural children (caption, colgroup, thead)
// and drop only the data-bearing tbody/tfoot, so skeleton rows stand in for the
// data while the real headings, caption and column layout remain.
const structuralChildren = (children: React.ReactNode): React.ReactNode =>
    React.Children.toArray(children).filter(
        (child) => !React.isValidElement(child) || (child.type !== "tbody" && child.type !== "tfoot"),
    );

export const Table = React.forwardRef<HTMLTableElement, React.PropsWithChildren<TableProps>>(
    ({ striped, hover, bordered, borderless, responsive, loading = false, loadingRows = 5, loadingCols, className, children, ...rest }, ref) => {
        const classes = classNames(
            "table",
            striped && "table-striped",
            hover && "table-hover",
            bordered && "table-bordered",
            borderless && "table-borderless",
            className,
        );

        const cols = loadingCols ?? inferColumnCount(children);

        const body = loading ? (
            <>
                {structuralChildren(children)}
                <tbody aria-busy="true">
                    <LoadingTableRows rows={loadingRows} cols={cols || 1} />
                </tbody>
            </>
        ) : children;

        const table = (
            <table ref={ref} className={classes} {...rest}>
                {body}
            </table>
        );

        if (responsive) {
            return <div className="table-responsive">{table}</div>;
        }

        return table;
    }
);

Table.displayName = "Table";
