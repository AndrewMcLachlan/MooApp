import { RouteObject } from "react-router-dom";

export type RouteDefinition = Record<string, Route>;

export interface Route extends Omit<RouteObject, "children"> {
    children?: RouteDefinition;
}
