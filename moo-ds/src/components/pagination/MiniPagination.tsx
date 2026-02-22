import { PaginationBase } from "./PaginationBase";
import { PaginationProps } from "./Pagination";

export const MiniPagination : React.FC<PaginationProps> = ({pageNumber, numberOfPages, onChange}) => {

    const showNext = pageNumber < numberOfPages;
    const showPrev = pageNumber > 1;

    return (
        <PaginationBase className="mini-pagination">
            <PaginationBase.Prev title="Previous page" disabled={!showPrev} onClick={() => onChange(pageNumber, Math.max(1, pageNumber-1))} />
            <PaginationBase.Next title="Next page" disabled={!showNext} onClick={() => onChange(pageNumber, Math.min(pageNumber + 1, numberOfPages))} />
        </PaginationBase>
    );
}

MiniPagination.displayName = "MiniPagination";
