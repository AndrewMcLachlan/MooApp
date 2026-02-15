import { Children, isValidElement, PropsWithChildren } from "react";

export const PaginationControls: React.FC<PropsWithChildren<PaginationControlsProps>> = ({ children }) => {

    Children.forEach(children, (child) => {
        if (isValidElement(child)) {
            const childName = (child.type as any)?.displayName;
            if (childName !== "PageSize" && childName !== "Pagination") {
                console.warn("PaginationControls can only accept PageSize and Pagination as children.", child.type);
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
