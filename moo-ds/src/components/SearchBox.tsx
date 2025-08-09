import { ValueProps } from "../models";

export const SearchBox: React.FC<ValueProps<string>> = (props) => (
    <input className="form-control search-box" value={props.value} onChange={(e) => props.onChange && props.onChange(e.currentTarget.value)} type="search" placeholder="Search..." />
);

SearchBox.displayName = "SearchBox";
