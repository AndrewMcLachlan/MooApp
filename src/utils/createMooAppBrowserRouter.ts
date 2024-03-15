import { createBrowserRouter } from "react-router-dom";
import { toRoutes } from "./toRoutes";
import { RouteDefinition } from "models/Route";

export const createMooAppBrowserRouter = (routes: RouteDefinition) => {
  return createBrowserRouter(toRoutes(routes));
}