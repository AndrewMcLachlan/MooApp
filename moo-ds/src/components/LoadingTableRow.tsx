import React from "react";
import { Skeleton } from "./Skeleton";

export const LoadingTableRow: React.FC<LoadingTableRowProps> = ({ cols }) => (
    <tr className="loading-row">
        {Array.from({ length: cols }).map((_, index) => (
            <td key={index}>
                <Skeleton.Text />
            </td>
        ))}
    </tr>
);

LoadingTableRow.displayName = "LoadingTableRow";

export interface LoadingTableRowProps {
    cols: number;
}
