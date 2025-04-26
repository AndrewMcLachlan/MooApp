import { PropsWithChildren } from "react";
import { PaginationProps } from "./Paginaton";
import { MiniPagination } from "./MiniPagination";
import classNames from "classnames";

export const PaginationTh: React.FC<PropsWithChildren<PaginationThProps>> = ({ children, ...props }) => {

    const { pageNumber, numberOfPages, onChange, ...thProps } = props;

    return (
        <th {...thProps}>
            <div className="pagination-th">
                <div>{children}</div>
                <MiniPagination
                    pageNumber={pageNumber}
                    numberOfPages={numberOfPages}
                    onChange={onChange} />
            </div>
        </th>
    );
};

PaginationTh.displayName = "PaginationTh";

export interface PaginationThProps extends PaginationProps, Omit<React.HTMLProps<HTMLTableCellElement>, "onChange"> {
}
