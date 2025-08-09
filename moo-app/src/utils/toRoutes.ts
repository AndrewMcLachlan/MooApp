import { RouteDefinition } from "../models/Route";
import { RouteObject } from "react-router";

export const toRoutes = (routes: RouteDefinition): RouteObject[] =>
     Object.keys(routes).map((key) => {
        const route = routes[key];
        return {
            ...route,
            children: route.children ? toRoutes(route.children) : undefined
        } as RouteObject;
    });
