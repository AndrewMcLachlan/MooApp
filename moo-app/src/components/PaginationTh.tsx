import { PropsWithChildren } from "react";
import { PaginationProps } from "./Paginaton";
import { MiniPagination } from "./MiniPagination";
import classNames from "classnames";

export const PaginationTh: React.FC<PropsWithChildren<PaginationThProps>> = ({ children, ...props }) => {

    const { pageNumber, numberOfPages, onChange, className, ...thProps } = props;

    return (
        <th {...thProps} className={classNames("pagination-th", className)}>
            <div>{children}</div>
            <MiniPagination
                pageNumber={pageNumber}
                numberOfPages={numberOfPages}
                onChange={onChange} />
        </th>
    );
};

PaginationTh.displayName = "PaginationTh";

export interface PaginationThProps extends PaginationProps, Omit<React.HTMLProps<HTMLTableCellElement>, "onChange"> {
}
