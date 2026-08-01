import { MooApp, NotFound } from "@andrewmclachlan/moo-app";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowsRotate, faBolt, faCheck, faCheckCircle, faChevronDown, faChevronRight, faChevronUp, faCircleChevronLeft, faCircleInfo, faCircleXmark, faFilterCircleXmark, faHeart, faInfoCircle, faLeaf, faLongArrowDown, faLongArrowUp, faPenToSquare, faPlus, faStar, faTimesCircle, faTrashAlt, faTriangleExclamation, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import axios from "axios";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CategoryOutlet } from "./routes/CategoryOutlet";
import { Home } from "./routes/Home";
import { PageSections } from "./routes/layout/PageSections";
import { DashboardPage } from "./routes/layout/Dashboard";
import { Navigation } from "./routes/layout/Navigation";
import { DrawerPage } from "./routes/layout/Drawer";
import { FormPage } from "./routes/forms/Form";
import { Inputs } from "./routes/forms/Inputs";
import { Buttons } from "./routes/forms/Buttons";
import { ComboBoxPage } from "./routes/forms/ComboBox";
import { TagPanelPage } from "./routes/forms/TagPanel";
import { UploadPage } from "./routes/forms/Upload";
import { TablePage } from "./routes/data/Table";
import { DataGridPage } from "./routes/data/DataGrid";
import { PaginationPage } from "./routes/data/Pagination";
import { Alerts } from "./routes/feedback/Alerts";
import { Notifications } from "./routes/feedback/Notifications";
import { Loading } from "./routes/feedback/Loading";
import { Badges } from "./routes/feedback/Badges";
import { Overlays } from "./routes/overlays/Overlays";
import { Icons } from "./routes/Icons";
import { Providers } from "./routes/app/Providers";
import { ErrorHandling } from "./routes/app/ErrorHandling";
import { Profile } from "./routes/Profile";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

console.debug((import.meta as any).env);
console.debug((import.meta as any).env.VITE_REACT_APP_VERSION);

library.add(faArrowsRotate, faCheck, faCheckCircle, faTrashAlt, faChevronDown, faChevronUp, faTimesCircle, faArrowLeft, faLongArrowUp, faLongArrowDown, faChevronRight, faCircleChevronLeft, faUpload, faXmark, faFilterCircleXmark, faInfoCircle, faPenToSquare, faPlus, faStar, faTriangleExclamation, faBolt, faLeaf, faHeart, faCircleInfo, faCircleXmark);

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFound,
});

// Redirect a bare category path to its first page. Categories have no landing
// page of their own.
const categoryIndex = (parent: any, to: string) =>
  createRoute({ getParentRoute: () => parent, path: "/", beforeLoad: () => { throw redirect({ to }); } });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });

// --- Layout ---------------------------------------------------------------
const layoutRoute = createRoute({ getParentRoute: () => rootRoute, path: "layout", component: CategoryOutlet });
const pageSectionsRoute = createRoute({ getParentRoute: () => layoutRoute, path: "page-sections", component: PageSections });
const dashboardRoute = createRoute({ getParentRoute: () => layoutRoute, path: "dashboard", component: DashboardPage });
const navigationRoute = createRoute({ getParentRoute: () => layoutRoute, path: "navigation", component: Navigation });
const drawerRoute = createRoute({ getParentRoute: () => layoutRoute, path: "drawer", component: DrawerPage });

// --- Forms ----------------------------------------------------------------
const formsRoute = createRoute({ getParentRoute: () => rootRoute, path: "forms", component: CategoryOutlet });
const formRoute = createRoute({ getParentRoute: () => formsRoute, path: "form", component: FormPage });
const inputsRoute = createRoute({ getParentRoute: () => formsRoute, path: "inputs", component: Inputs });
const buttonsRoute = createRoute({ getParentRoute: () => formsRoute, path: "buttons", component: Buttons });
const comboBoxRoute = createRoute({ getParentRoute: () => formsRoute, path: "combo-box", component: ComboBoxPage });
const tagPanelRoute = createRoute({ getParentRoute: () => formsRoute, path: "tag-panel", component: TagPanelPage });
const uploadRoute = createRoute({ getParentRoute: () => formsRoute, path: "upload", component: UploadPage });

// --- Data & Tables --------------------------------------------------------
const dataRoute = createRoute({ getParentRoute: () => rootRoute, path: "data", component: CategoryOutlet });
const tableRoute = createRoute({ getParentRoute: () => dataRoute, path: "table", component: TablePage });
const dataGridRoute = createRoute({ getParentRoute: () => dataRoute, path: "data-grid", component: DataGridPage });
const paginationRoute = createRoute({ getParentRoute: () => dataRoute, path: "pagination", component: PaginationPage });

// --- Feedback -------------------------------------------------------------
const feedbackRoute = createRoute({ getParentRoute: () => rootRoute, path: "feedback", component: CategoryOutlet });
const alertsRoute = createRoute({ getParentRoute: () => feedbackRoute, path: "alerts", component: Alerts });
const notificationsRoute = createRoute({ getParentRoute: () => feedbackRoute, path: "notifications", component: Notifications });
const loadingRoute = createRoute({ getParentRoute: () => feedbackRoute, path: "loading", component: Loading });
const badgesRoute = createRoute({ getParentRoute: () => feedbackRoute, path: "badges", component: Badges });

// --- Single-page categories ----------------------------------------------
const overlaysRoute = createRoute({ getParentRoute: () => rootRoute, path: "overlays", component: Overlays });
const iconsRoute = createRoute({ getParentRoute: () => rootRoute, path: "icons", component: Icons });

// --- App framework --------------------------------------------------------
const appRoute = createRoute({ getParentRoute: () => rootRoute, path: "app", component: CategoryOutlet });
const providersRoute = createRoute({ getParentRoute: () => appRoute, path: "providers", component: Providers });
const errorHandlingRoute = createRoute({ getParentRoute: () => appRoute, path: "error-handling", component: ErrorHandling });

// --- User menu ------------------------------------------------------------
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "profile", component: Profile });
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: "settings", component: Profile });

const routeTree = rootRoute.addChildren([
  indexRoute,
  layoutRoute.addChildren([
    categoryIndex(layoutRoute, "/layout/page-sections"),
    pageSectionsRoute,
    dashboardRoute,
    navigationRoute,
    drawerRoute,
  ]),
  formsRoute.addChildren([
    categoryIndex(formsRoute, "/forms/form"),
    formRoute,
    inputsRoute,
    buttonsRoute,
    comboBoxRoute,
    tagPanelRoute,
    uploadRoute,
  ]),
  dataRoute.addChildren([
    categoryIndex(dataRoute, "/data/table"),
    tableRoute,
    dataGridRoute,
    paginationRoute,
  ]),
  feedbackRoute.addChildren([
    categoryIndex(feedbackRoute, "/feedback/alerts"),
    alertsRoute,
    notificationsRoute,
    loadingRoute,
    badgesRoute,
  ]),
  overlaysRoute,
  iconsRoute,
  appRoute.addChildren([
    categoryIndex(appRoute, "/app/providers"),
    providersRoute,
    errorHandlingRoute,
  ]),
  profileRoute,
  settingsRoute,
]);

// @ts-expect-error strictNullChecks is false (to match the moo-ds/moo-app source) — TanStack Router requires it for full type safety
const router = createRouter({ routeTree });

// A real app passes its hey-api generated client's instance
// (`client={client.instance}`); demoo makes no API calls, so a bare axios
// instance is enough to satisfy MooApp.
const client = axios.create({ baseURL: "/" });

root.render(
  <MooApp client={client} clientId="69f9579b-ea94-4317-a257-5dd921e137dc" scopes={["api://demoo.mclachlan.family/api.read"]} name="DeMoo" version={(import.meta as any).env.VITE_REACT_APP_VERSION} copyrightYear={2022} router={router} />
);
