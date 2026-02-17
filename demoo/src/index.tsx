import { MooApp, NotFound, createMooAppBrowserRouter } from "@andrewmclachlan/moo-app";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowsRotate, faCheck, faCheckCircle, faChevronDown, faChevronRight, faChevronUp, faCircleChevronLeft, faFilterCircleXmark, faInfoCircle, faLongArrowDown, faLongArrowUp, faPenToSquare, faPlus, faTimesCircle, faTrashAlt, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Components } from "./pages/Components";
import { IconButtonComponent } from "./pages/components/IconButtonComponent";
import { IconLinkButtonComponent } from "./pages/components/IconLinkButtonComponent";
import { LinkBoxComponent } from "./pages/components/LinkBoxComponent";
import { PasswordComponent } from "./pages/form/PasswordComponent";
import { FormComponent } from "./pages/components/Form";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Providers } from "./pages/Providers";
import { TagPanel } from "./pages/components/TagPanel";
import { ErrorPage } from "./pages/ErrorPage";
import { Notifications } from "./pages/Notifications";
import { FormSample } from "./pages/form/FormSample";
import { Table } from "./pages/Table";
import { DataGridPage } from "./pages/DataGrid";
import { Overlays } from "./pages/Overlays";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

console.debug((import.meta as any).env);
console.debug((import.meta as any).env.VITE_REACT_APP_VERSION);

library.add(faArrowsRotate, faCheck, faCheckCircle, faTrashAlt, faChevronDown, faChevronUp, faTimesCircle, faArrowLeft, faLongArrowUp, faLongArrowDown, faChevronRight, faCircleChevronLeft, faUpload, faXmark, faFilterCircleXmark, faInfoCircle, faPenToSquare, faPlus);

const router = createMooAppBrowserRouter({
  layout: {
    path: "/", element: <App />, children: {
      home: { path: "/", element: <Home /> },
      components: { path: "/components", element: <Components /> },
      providers: { path: "/providers", element: <Providers /> },
      errorPage: { path: "/error-page", element: <ErrorPage /> },
      iconLinkButton: { path: "/components/icon-link-button", element: <IconLinkButtonComponent /> },
      iconButton: { path: "/components/icon-button", element: <IconButtonComponent /> },
      linkBox: { path: "/components/link-box", element: <LinkBoxComponent /> },
      form: {
        path: "/form", element: <FormComponent />, children: {
          sample: { path: "", element: <FormSample /> },
          password: { path: "password", element: <PasswordComponent /> },
        },
      },
      notifications: { path: "/notifications", element: <Notifications /> },
      tagPanel: { path: "/components/tag-panel", element: <TagPanel /> },
      settings: { path: "/settings", element: <Components /> },
      profile: { path: "/profile", element: <Profile /> },
      table: {path: "/table", element: <Table /> },
      dataGrid: { path: "/data-grid", element: <DataGridPage /> },
      overlays: { path: "/overlays", element: <Overlays /> },
      fallback: { path: "*", element: <NotFound /> },
    }
  }
});


root.render(
  <MooApp clientId="045f8afa-70f2-4700-ab75-77ac41b306f7" scopes={["api://moobank.mclachlan.family/api.read"]} name="DeMoo" version={(import.meta as any).env.VITE_REACT_APP_VERSION} copyrightYear={2022} router={router} />
);
