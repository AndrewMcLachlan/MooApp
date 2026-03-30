import { type SortDirection } from "../models";

export const changeSortDirection = (sortDirection: SortDirection) => 
     sortDirection === "Ascending" ? "Descending" : "Ascending";
