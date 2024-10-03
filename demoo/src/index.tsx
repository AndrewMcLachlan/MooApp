import { MooApp, createMooAppBrowserRouter } from "@andrewmclachlan/mooapp";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowsRotate, faCheck, faCheckCircle, faChevronDown, faChevronRight, faChevronUp, faCircleChevronLeft, faFilterCircleXmark, faInfoCircle, faLongArrowDown, faLongArrowUp, faPenToSquare, faPlus, faTimesCircle, faTrashAlt, faUpload, faXmark } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import App from "./App";
import { Components } from './pages/Components';
import { IconButtonComponent } from "./pages/components/IconButtonComponent";
import { IconLinkButtonComponent } from "./pages/components/IconLinkButtonComponent";
import { Home } from './pages/Home';
import { Profile } from "./pages/Profile";
import { Providers } from './pages/Providers';
import { TagPanel } from './pages/TagPanel';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
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
      componentsSubcomponents: { path: "/components/iconlinkbutton", element: <IconLinkButtonComponent /> },
      componentsIconButton: { path: "/components/iconbutton", element: <IconButtonComponent /> },
      tagPanel: {path: "/tag-panel", element: <TagPanel />},
      settings: { path: "/settings", element: <Components /> },
      profile: {path: "/profile", element: <Profile />},
    }
  }
});


root.render(
  <MooApp clientId="045f8afa-70f2-4700-ab75-77ac41b306f7" scopes={["api://moobank.mclachlan.family/api.read"]} name="DeMoo" version={(import.meta as any).env.VITE_REACT_APP_VERSION}>
    <RouterProvider router={router} />
  </MooApp>
);
