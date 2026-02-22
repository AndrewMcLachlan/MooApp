import { MooApp, NotFound } from "@andrewmclachlan/moo-app";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowsRotate, faCheck, faCheckCircle, faChevronDown, faChevronRight, faChevronUp, faCircleChevronLeft, faFilterCircleXmark, faInfoCircle, faLongArrowDown, faLongArrowUp, faPenToSquare, faPlus, faTimesCircle, faTrashAlt, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Components } from "./routes/Components";
import { IconButtonComponent } from "./routes/components/IconButtonComponent";
import { IconLinkButtonComponent } from "./routes/components/IconLinkButtonComponent";
import { LinkBoxComponent } from "./routes/components/LinkBoxComponent";
import { PasswordComponent } from "./routes/form/PasswordComponent";
import { FormComponent } from "./routes/components/Form";
import { Home } from "./routes/Home";
import { Profile } from "./routes/Profile";
import { Providers } from "./routes/Providers";
import { TagPanel } from "./routes/components/TagPanel";
import { ErrorPage } from "./routes/ErrorPage";
import { Notifications } from "./routes/Notifications";
import { FormSample } from "./routes/form/FormSample";
import { Table } from "./routes/Table";
import { Overlays } from "./routes/Overlays";
import { DataGridPage } from "./routes/DataGrid";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

console.debug((import.meta as any).env);
console.debug((import.meta as any).env.VITE_REACT_APP_VERSION);

library.add(faArrowsRotate, faCheck, faCheckCircle, faTrashAlt, faChevronDown, faChevronUp, faTimesCircle, faArrowLeft, faLongArrowUp, faLongArrowDown, faChevronRight, faCircleChevronLeft, faUpload, faXmark, faFilterCircleXmark, faInfoCircle, faPenToSquare, faPlus);

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const componentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "components",
});

const componentsIndexRoute = createRoute({
  getParentRoute: () => componentsRoute,
  path: "/",
  component: Components,
});

const iconLinkButtonRoute = createRoute({
  getParentRoute: () => componentsRoute,
  path: "icon-link-button",
  component: IconLinkButtonComponent,
});

const iconButtonRoute = createRoute({
  getParentRoute: () => componentsRoute,
  path: "icon-button",
  component: IconButtonComponent,
});

const linkBoxRoute = createRoute({
  getParentRoute: () => componentsRoute,
  path: "link-box",
  component: LinkBoxComponent,
});

const tagPanelRoute = createRoute({
  getParentRoute: () => componentsRoute,
  path: "tag-panel",
  component: TagPanel,
});

const providersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "providers",
  component: Providers,
});

const errorPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "error-page",
  component: ErrorPage,
});

const formRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "form",
  component: FormComponent,
});

const formIndexRoute = createRoute({
  getParentRoute: () => formRoute,
  path: "/",
  component: FormSample,
});

const passwordRoute = createRoute({
  getParentRoute: () => formRoute,
  path: "password",
  component: PasswordComponent,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "notifications",
  component: Notifications,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "settings",
  component: Components,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "profile",
  component: Profile,
});

const tableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "table",
  component: Table,
});

const overlaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "overlays",
  component: Overlays,
});

const dataGridRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "data-grid",
  component: DataGridPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  componentsRoute.addChildren([
    componentsIndexRoute,
    iconLinkButtonRoute,
    iconButtonRoute,
    linkBoxRoute,
    tagPanelRoute,
  ]),
  providersRoute,
  errorPageRoute,
  formRoute.addChildren([
    formIndexRoute,
    passwordRoute,
  ]),
  notificationsRoute,
  settingsRoute,
  profileRoute,
  tableRoute,
  overlaysRoute,
  dataGridRoute,
]);

const router = createRouter({ routeTree });

root.render(
  <MooApp clientId="045f8afa-70f2-4700-ab75-77ac41b306f7" scopes={["api://moobank.mclachlan.family/api.read"]} name="DeMoo" version={(import.meta as any).env.VITE_REACT_APP_VERSION} copyrightYear={2022} router={router} />
);
