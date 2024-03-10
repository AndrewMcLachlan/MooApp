import { RouteObject } from "react-router-dom";

export type RouteDefinition = Record<string, Route>;

interface Route extends Omit<RouteObject, "children"> {
    children?: RouteDefinition;
}