import { PaginationBase } from "./PaginationBase";
import { type PaginationProps } from "./Pagination";

export const MiniPagination : React.FC<PaginationProps> = ({pageNumber, numberOfPages, onChange}) => {

    const showNext = pageNumber < numberOfPages;
    const showPrev = pageNumber > 1;

    return (
        <PaginationBase className="mini-pagination">
            <PaginationBase.Prev title="Previous page" disabled={!showPrev} onClick={(e) => { e.stopPropagation(); onChange(pageNumber, Math.max(1, pageNumber-1)); }} />
            <PaginationBase.Next title="Next page" disabled={!showNext} onClick={(e) => { e.stopPropagation(); onChange(pageNumber, Math.min(pageNumber + 1, numberOfPages)); }} />
        </PaginationBase>
    );
}

MiniPagination.displayName = "MiniPagination";
