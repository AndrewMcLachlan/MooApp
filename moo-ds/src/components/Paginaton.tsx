import { getPagesToDisplay } from "../utils/paging";
import { PaginationBase } from "./PaginationBase";

export const Pagination : React.FC<PaginationProps> = ({pageNumber, numberOfPages, onChange}) => {

    const showNext = pageNumber < numberOfPages;
    const showPrev = pageNumber > 1;

    const pagesToDisplay = getPagesToDisplay(pageNumber, numberOfPages);

    return (
        <PaginationBase>
            <PaginationBase.First disabled={!showPrev} onClick={() => onChange(pageNumber, 1)} />
            <PaginationBase.Prev disabled={!showPrev} onClick={() => onChange(pageNumber, Math.max(1, pageNumber-1))} />
            {pagesToDisplay.map((page) => (
                <PaginationBase.Item key={page} active={page === pageNumber} onClick={() => onChange(pageNumber, page)}>
                    {page}
                </PaginationBase.Item>
            ))}
            <PaginationBase.Next disabled={!showNext} onClick={() => onChange(pageNumber, Math.min(pageNumber + 1, numberOfPages))} />
            <PaginationBase.Last disabled={!showNext} onClick={() => onChange(pageNumber, numberOfPages)} />
        </PaginationBase>
    );
}

Pagination.displayName = "Pagination";

export interface PaginationProps {
    pageNumber: number,
    numberOfPages: number,
    onChange: (currentPageNumber: number, newPageNumber: number) => void;
}
