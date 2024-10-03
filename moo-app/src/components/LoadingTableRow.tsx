import React from "react";

export const LoadingTableRow: React.FC<LoadingTableRowProps> = ({cols}) => (
    <tr>
        {Array.from({length: cols}).map((_, index) => <td key={index}>&nbsp;</td>)}
    </tr>
);

export interface LoadingTableRowProps {
    cols: number;
}