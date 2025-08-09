import { RouteObject } from "react-router";

export type RouteDefinition = Record<string, Route>;

export interface Route extends Omit<RouteObject, "children"> {
    children?: RouteDefinition;
}
