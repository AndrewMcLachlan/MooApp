import { Pagination as BSPagination } from "react-bootstrap"
import { PaginationProps } from "./Paginaton";

export const MiniPagination : React.FC<PaginationProps> = ({pageNumber, numberOfPages, onChange}) => {

    const showNext = pageNumber < numberOfPages;
    const showPrev = pageNumber > 1;

    return (
        <BSPagination>
            <BSPagination.Prev title="Previous page" disabled={!showPrev} onClick={() => onChange(pageNumber, Math.max(1, pageNumber-1))} />
            <BSPagination.Next title="Next page" disabled={!showNext} onClick={() => onChange(pageNumber, Math.min(pageNumber + 1, numberOfPages))} />
        </BSPagination>
    );
}

MiniPagination.displayName = "MiniPagination";
