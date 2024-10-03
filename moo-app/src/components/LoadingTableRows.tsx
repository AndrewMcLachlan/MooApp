import React from "react";
import { LoadingTableRow, LoadingTableRowProps } from "./LoadingTableRow";

export const LoadingTableRows: React.FC<LoadingTableRowsProps> = ({rows, ...rest}) => 
    Array.from({length: rows}).map((_, index) => <LoadingTableRow key={index} {...rest} />);

export interface LoadingTableRowsProps extends LoadingTableRowProps {
    rows: number;
}