import { Children, isValidElement, PropsWithChildren } from "react";
import { PageSize } from "./PageSize";
import { Pagination } from "./Paginaton";
import { Pagination as BSPagination } from "react-bootstrap";

export const PaginationControls: React.FC<PropsWithChildren<PaginationControlsProps>> = ({ children }) => {

    Children.forEach(children, (child) => {
        if (isValidElement(child)) {
            if (child.type !== PageSize && child.type !== Pagination && child.type !== BSPagination) {
                console.warn("PaginationControls can only accept PageSize and Pagination as children.");
            }
        }
    });

    return (
        <div className="pagination-controls">
            {children}
        </div>
    );
};

PaginationControls.displayName = "PaginationControls";

export interface PaginationControlsProps {
}
