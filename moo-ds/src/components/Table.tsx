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

// Count the cells in the first header row so skeleton rows match the real
// column layout without the consumer having to state it.
const inferColumnCount = (children: React.ReactNode): number => {
    let count = 0;
    React.Children.forEach(children, (child) => {
        if (count || !React.isValidElement(child) || child.type !== "thead") return;
        React.Children.forEach((child.props as { children?: React.ReactNode }).children, (row) => {
            if (count || !React.isValidElement(row) || row.type !== "tr") return;
            count = React.Children.toArray((row.props as { children?: React.ReactNode }).children).length;
        });
    });
    return count;
};

// Keep only the header while loading, so skeleton rows sit under the real column
// headings and any footer (e.g. pagination) is hidden until data arrives.
const headerOnly = (children: React.ReactNode): React.ReactNode =>
    React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === "thead");

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
                {headerOnly(children)}
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
