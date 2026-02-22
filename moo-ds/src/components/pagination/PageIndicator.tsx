export interface PageIndicatorProps {
    pageNumber: number;
    pageCount: number;
    totalRows: number;
    dataType: string;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({ pageNumber, pageCount, totalRows, dataType }) => (
    <span className="page-indicator">
        Page {pageNumber} of {pageCount} ({totalRows} {dataType})
    </span>
);

PageIndicator.displayName = "PageIndicator";
