export const PageSize: React.FC<PageSizeProps> = ({id = "page-size", pageSizes = [10,20,50,100], value, onChange}) => {
    return (
        <div className="page-size">
            <label htmlFor={id}>Page Size</label>
            <select id={id} className="form-select" value={value} onChange={(e) => onChange(Number(e.target.value))}>
                {pageSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>
        </div>
    );
};

PageSize.displayName = "PageSize";

export interface PageSizeProps {
    id?: string;
    pageSizes?: number[];
    value: number;
    onChange: (newPageSize: number) => void;
}
