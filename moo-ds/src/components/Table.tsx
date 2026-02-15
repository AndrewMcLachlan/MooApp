import classNames from "classnames";
import React from "react";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    striped?: boolean;
    hover?: boolean;
    bordered?: boolean;
    borderless?: boolean;
    responsive?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, React.PropsWithChildren<TableProps>>(
    ({ striped, hover, bordered, borderless, responsive, className, children, ...rest }, ref) => {
        const classes = classNames(
            "table",
            striped && "table-striped",
            hover && "table-hover",
            bordered && "table-bordered",
            borderless && "table-borderless",
            className,
        );

        const table = (
            <table ref={ref} className={classes} {...rest}>
                {children}
            </table>
        );

        if (responsive) {
            return <div className="table-responsive">{table}</div>;
        }

        return table;
    }
);

Table.displayName = "Table";
